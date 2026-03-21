{
  stdenv,
  meson,
  raylib,
  ninja,
  pkg-config,
  libtorrent-rasterbar,
}:
stdenv.mkDerivation (finalAttrs: {
  pname = "camp-client";
  version = "0.0.1";

  src = ../.;

  nativeBuildInputs = [
    meson
    ninja
    pkg-config
  ];

  buildInputs = [
    raylib
    libtorrent-rasterbar
  ];
})
