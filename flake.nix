{
  description = "Valence ZK Vault Template Development Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
          pkgs = import nixpkgs {
          inherit system;
        };

        nodejs = pkgs.nodejs_22;
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            foundry
            git
            curl
          ];

          shellHook = ''
            echo ""
            export PS1="\[\033[1;36m\]Dev Shell \W \$\[\033[0m\] " # special chars change the color of the prompt
          '';
        };
      });
}
