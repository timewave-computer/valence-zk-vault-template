#!/bin/bash
set -euo pipefail
source .env

# Create lib directory if it doesn't exist
mkdir -p lib


# Download dependencies directly
echo "Downloading dependencies..."

# Download forge-std
if [ ! -d lib/forge-std ]; then
echo "Downloading forge-std..."
curl -L https://github.com/foundry-rs/forge-std/archive/refs/tags/v1.7.6.tar.gz | tar xz
mv forge-std-1.7.6 lib/forge-std
fi


# Download OpenZeppelin contracts
if [ ! -d lib/openzeppelin-contracts ]; then
echo "Downloading OpenZeppelin contracts..."
curl -L https://github.com/OpenZeppelin/openzeppelin-contracts/archive/refs/tags/v5.0.1.tar.gz | tar xz
mv openzeppelin-contracts-5.0.1 lib/openzeppelin-contracts
fi

# Check if Anvil is running
if [ ! -f .anvil.pid ]; then
echo "Error: Anvil is not running. Please start it first with 'start-anvil'"
exit 1
fi

# Check if the process is actually running
if ! kill -0 $(cat .anvil.pid) 2>/dev/null; then
echo "Error: Anvil process not found. Please restart it with 'start-anvil'"
rm .anvil.pid
exit 1
fi

# Test RPC connection
echo "Testing connection to Anvil..."
if ! curl -s -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}' \
http://localhost:8545 > /dev/null; then
echo "Error: Cannot connect to Anvil node at http://localhost:8545"
exit 1
fi

echo "Connected to Anvil node successfully!"

# Check for DEPLOYER_PRIVATE_KEY in environment
if [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
echo "Error: DEPLOYER_PRIVATE_KEY not found in environment."
echo "Please run 'manage-key' to generate or configure a deployer key."
exit 1
fi

DEPLOYER_ADDRESS=$(cast wallet address "$DEPLOYER_PRIVATE_KEY")

# Fund the deployer account with 10000 ETH
echo "Funding deployer account..."
curl -s -X POST -H "Content-Type: application/json" \
--data "{\"jsonrpc\":\"2.0\",\"method\":\"anvil_setBalance\",\"params\":[\"$DEPLOYER_ADDRESS\", \"0x21E19E0C9BAB2400000\"],\"id\":1}" \
http://localhost:8545 > /dev/null

# Also fund with some ETH for gas
curl -s -X POST -H "Content-Type: application/json" \
--data "{\"jsonrpc\":\"2.0\",\"method\":\"anvil_setBalance\",\"params\":[\"$DEPLOYER_ADDRESS\", \"0x56BC75E2D630E00000\"],\"id\":1}" \
http://localhost:8545 > /dev/null

echo "Deployer address: $DEPLOYER_ADDRESS"
echo "Building and deploying contracts..."

# Build and deploy the contracts
if ! forge script scripts/DeployVaults.s.sol:DeployVaults \
--out forge-artifacts \
--rpc-url http://localhost:8545 \
--broadcast \
--private-key $DEPLOYER_PRIVATE_KEY \
--gas-limit 30000000 \
--gas-price 1000000000 2>&1 | tee deployment.log; then
echo "Error: Deployment failed. Check deployment.log for details."
exit 1
fi

# Extract and save contract addresses
echo "Saving deployed addresses..."
if grep "Deployed addresses:" -A 6 deployment.log > deployed-addresses.txt; then
# Extract addresses and save to .env.local
# Use awk for more reliable extraction
USDC_ADDRESS=$(awk '/USDC:/ {print $2}' deployed-addresses.txt)
USDC_VAULT_ADDRESS=$(awk '/USDC Vault:/ {print $3}' deployed-addresses.txt)

# Verify addresses were extracted
if [ -z "$USDC_ADDRESS" ] || [ -z "$USDC_VAULT_ADDRESS" ]; then
    echo "Error: Failed to extract one or more addresses"
    echo "Content of deployed-addresses.txt:"
    cat deployed-addresses.txt
    exit 1
fi

# Export variables immediately for current session
export USDC_ADDRESS
export USDC_VAULT_ADDRESS

# Create session-specific Next.js environment file
{
    echo "# Session-specific environment variables"
    echo "NEXT_PUBLIC_USDC_ADDRESS=$USDC_ADDRESS"
    echo "NEXT_PUBLIC_USDC_VAULT_ADDRESS=$USDC_VAULT_ADDRESS"
} > .env.local

rm deployment.log
echo "Vaults deployed successfully!"
echo "Session-specific addresses saved to .env.local"
echo "Token addresses exported to environment:"
echo "USDC: $USDC_ADDRESS"
echo "USDC Vault: $USDC_VAULT_ADDRESS"
else
echo "Error: Could not find deployed addresses in output."
exit 1
fi
