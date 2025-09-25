// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

// Mock ERC20 with mint and burn functionality for testing
contract MockToken is ERC20 {
    uint8 private _decimals;

    constructor(string memory name, string memory symbol, uint8 decimalsValue) ERC20(name, symbol) {
        _decimals = decimalsValue;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}

// Simple ERC4626 vault implementation
contract SimpleVault is ERC4626 {
    constructor(IERC20 asset, string memory name, string memory symbol) ERC4626(asset) ERC20(name, symbol) {}

    // Optional: Override to add management fees, etc.
    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }
}

contract DeployVaults is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MockToken usdc = new MockToken("USD Coin", "USDC", 6);
        MockToken btc = new MockToken("Bitcoin", "BTC", 8);
        MockToken eth = new MockToken("Ethereum", "ETH", 18);

        SimpleVault usdcVault = new SimpleVault(usdc, "USDC Vault", "vUSDC");
        SimpleVault btcVault = new SimpleVault(btc, "BTC Vault", "vBTC");
        SimpleVault ethVault = new SimpleVault(eth, "ETH Vault", "vETH");

        vm.stopBroadcast();

        // Log deployed addresses
        console.log("Deployed addresses:");
        console.log("USDC:", address(usdc));
        console.log("USDC Vault:", address(usdcVault));
        console.log("BTC:", address(btc));
        console.log("BTC Vault:", address(btcVault));
        console.log("ETH:", address(eth));
        console.log("ETH Vault:", address(ethVault));
    }
} 