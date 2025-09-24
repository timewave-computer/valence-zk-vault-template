#!/bin/bash
set -e

if [ -f .anvil.pid ]; then
    echo "Killing Anvil node..."
    kill $(cat .anvil.pid)
    rm .anvil.pid
    echo "Anvil node killed"
else
    echo "Anvil node not running"
fi