{
  description = "Valence ZK Vault Template Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
          pkgs = import nixpkgs {
          inherit system;
        };

        nodejs = pkgs.nodejs_22;
        npm = pkgs.nodePackages.npm;
      in
      {
        devShells.default = pkgs.mkShell {
            buildInputs = [
            nodejs
            npm
            pkgs.git
        #  foundry
          ];

          shellHook = ''
            export PS1="\[\033[1;36m\]Dev Shell \w \$\[\033[0m\]" # special chars change the color of the prompt
            echo "🚀 Valence ZK Vault Template Development Environment"
            echo "📦 Node.js version: $(node --version)"
            echo "📦 npm version: $(npm --version)"
            echo "🔨 Foundry version: $(forge --version)"
            echo "⚡ Anvil available: $(anvil --version)"
            echo ""
          '';
        };
      });
}
