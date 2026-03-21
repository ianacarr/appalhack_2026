{
  system,
  mkShell,
  libtorrent-rasterbar,
  meson,
  raylib,
  ninja,
  tree,
  pkg-config,
  self,
}: let
  inherit (self.checks.${system}) pre-commit-check;
in
  mkShell {
    packages = [
      meson
      ninja
      raylib
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
