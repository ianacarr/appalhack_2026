{
  system,
  mkShell,
  libtorrent-rasterbar,
  meson,
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
