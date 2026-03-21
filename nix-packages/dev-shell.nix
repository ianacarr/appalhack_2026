{
  system,
  mkShell,
  libtorrent-rasterbar,
  cmake,
  gnumake,
  boost,
  tree,
  pkg-config,
  self,
}: let
  inherit (self.checks.${system}) pre-commit-check;
in
  mkShell {
    packages = [
      cmake
      boost
      gnumake
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
