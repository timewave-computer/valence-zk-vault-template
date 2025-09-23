#!/bin/bash

# Function to generate a new key
generate_new_key() {
    NEW_KEY=$(cast wallet new | grep "Private key" | cut -d: -f2 | tr -d ' ')
    NEW_ADDRESS=$(cast wallet address "$NEW_KEY")
    
    # Write persistent environment variables to .env
    echo "# Persistent environment variables" > .env
    echo "DEPLOYER_PRIVATE_KEY=$NEW_KEY" >> .env
    echo "DEPLOYER_ADDRESS=$NEW_ADDRESS" >> .env
    
    # Export variables to current environment
    export DEPLOYER_PRIVATE_KEY=$NEW_KEY
    export DEPLOYER_ADDRESS=$NEW_ADDRESS
    
    echo "New private key and address saved to .env file"
    echo "Corresponding address: $NEW_ADDRESS"
    echo "Environment variables have been set for the current session"
}

# Function to show current key info
show_key_info() {
    if [ -n "$DEPLOYER_PRIVATE_KEY" ]; then
        if [ -n "$DEPLOYER_ADDRESS" ]; then
            ADDRESS="$DEPLOYER_ADDRESS"
        else
            ADDRESS=$(${pkgs.foundry}/bin/cast wallet address "$DEPLOYER_PRIVATE_KEY")
        fi
        echo "Current deployer address: $ADDRESS"
    else
        if [ -f .env ]; then
            echo "Found .env file. Loading variables..."
            set -a
            source .env
            set +a
            show_key_info
        else
            echo "No private key found in environment"
        fi
    fi
}

# Main menu
echo "Deployer Key Management"
echo "1. Generate new key"
echo "2. Show current key info"
echo "3. Exit"
read -p "Select an option (1-3): " choice

case $choice in
    1)
        generate_new_key
        ;;
    2)
        show_key_info
        ;;
    3)
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac