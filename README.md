# Valence Vault ZK Template

## Getting started
1. Install prerequisites
- [Nix](https://nixos.org/download/)

2. Start the development environment (the first time may take a few minutes):

```bash
nix develop
```

3. Start ethereum testnet node. The Nix environment adds all scripts in `scripts/` to the dev shell path, so you can run it directly.
```bash
start-anvil.sh
```

4. Generate a deploy key
```bash
manage-key.sh
```

5. Deploy vaults.
- the script will fund the deployer, downloading sol primitives and open zepellin contracts to `lib`, and run a solidity deployment script to deploy the contracts
- if there are deployment errors, inspect `anvil.log` and `broadcast/run-latest.json`
```bash
deploy-vault.sh
```
