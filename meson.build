project(
  'camp-client',
  'cpp',
  version: '0.0.1',
  meson_version : '>= 1.1.0',
  default_options : [
    'cpp_std=c++20',
    'errorlogs=true',
    'warning_level=3',
  ]
)

deps = [ dependency('libtorrent-rasterbar'), dependency('raylib') ]
subdir('src')

client = executable(
  'camp-client',
  campclient_sources,
  dependencies: deps,
  install: true
)


