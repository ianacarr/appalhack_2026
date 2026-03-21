cmake_minimum_required(VERSION 4.0)

set(PROJECT_NAME appalhack_2026)
project(${PROJECT_NAME})

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CONFIGURATION_TYPES Release Debug)

add_subdirectory(lib/libtorrent)

file(GLOB_RECURSE SOURCES CONFIGURE_DEPENDS "src/*.cpp")
add_executable(${PROJECT_NAME} ${SOURCES})

target_include_directories(${PROJECT_NAME} PRIVATE
	lib/libtorrent
	src
)

target_link_libraries(${PROJECT_NAME} PRIVATE
	libtorrent
)