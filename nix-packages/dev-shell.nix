{
  self,
  stdenv,
  mkShell,
  nodejs,
  nodePackages,
  yarn,
}: let
  inherit (self.checks.${stdenv.hostPlatform.system}) pre-commit-check;
in
  mkShell {
    packages = [
      nodejs
      nodePackages.prettier
      yarn
    ];

    buildInputs = pre-commit-check.enabledPackages;

    shellHook =
      pre-commit-check.shellHook
      + ''
        echo "Development Shell ready"
      '';
  }
