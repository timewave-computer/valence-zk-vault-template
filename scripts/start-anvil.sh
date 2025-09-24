#!/bin/bash

# Script to start the Anvil node

# Check if Anvil is already running
if [ -f .anvil.pid ]; then
    echo "Anvil process already running. Stopping it first..."
    kill $(cat .anvil.pid) 2>/dev/null || true
    rm .anvil.pid
fi

echo "Starting Anvil node..."
anvil \
    --block-time 12 \
    --chain-id 31337 \
    --balance 10000 \
    --fork-url https://eth-mainnet.public.blastapi.io \
    --fork-block-number 23000000 > anvil.log 2>&1 & echo $! > .anvil.pid

# Wait for Anvil to start
echo "Waiting for Anvil to initialize..."
while ! grep -q "Listening on" anvil.log 2>/dev/null; do
    if ! kill -0 $(cat .anvil.pid) 2>/dev/null; then
        echo "Error: Anvil process died. Check anvil.log for details."
        exit 1
    fi
    sleep 1
done

echo "Anvil is ready! Listening on http://localhost:8545"
echo "Process ID: $(cat .anvil.pid)"
echo "Log file: anvil.log"

echo "Anvil started in background. Use 'kill-anvil.sh' to stop it."
echo "To view logs: tail -f anvil.log"