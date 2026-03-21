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

deps = [ dependency('torrent-rasterbar') ]

client = executable('camp-client', 'main.cpp', dependencies: deps)
