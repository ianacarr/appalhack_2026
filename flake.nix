{
  description = "C++ Torrent Client Camp Themed";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.pre-commit-hooks.url = "github:cachix/git-hooks.nix";

  outputs = {
    self,
    nixpkgs,
    pre-commit-hooks,
    ...
  }: let
    # Supported systems, non-exhaustive as of now
    supportedSystems = [
      "x86_64-linux"
      "x86_64-darwin"
      "aarch64-linux"
      "aarch64-darwin"
    ];

    forAllSystems = func:
      nixpkgs.lib.genAttrs supportedSystems
      (
        system: (
          func
          system
          (import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          })
        )
      );
  in {
    overlays.default = final: prev: self.packages.${final.system};

    packages = forAllSystems (
      system: pkgs: (pkgs.lib.packagesFromDirectoryRecursive {
        directory = ./nix-packages;
        callPackage = pkgs.newScope (
          self.packages.${system}
          // {self = builtins.removeAttrs self ["packages"];}
        );
      })
    );

    devShells = forAllSystems (system: pkgs: {
      default = self.packages.${system}.dev-shell;
    });

    checks = forAllSystems (system: pkgs: {
      pre-commit-check = pre-commit-hooks.lib.${system}.run {
        src = ./.;
        hooks = {
          alejandra.enable = true;
          prettier.enable = true;
        };
      };
    });
  };
}
