{
  system,
  mkShell,
  libtorrent-rasterbar,
  cmake,
  tree,
  pkg-config,
  self,
}: let
  inherit (self.checks.${system}) pre-commit-check;
in
  mkShell {
    packages = [
      cmake
      tree
      libtorrent-rasterbar
      pkg-config
    ];

    shellHook =
      pre-commit-check.shellHook
      + ''
        echo "Development Shell ready"
      '';
  }
