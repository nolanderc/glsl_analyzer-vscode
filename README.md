# glsl_analyzer-vscode

Language server support for GLSL (OpenGL Shading Language) in Visual Studio Code.

## Features

- Completion 
    - User-defined variables/functions.
    - Built-in types (e.g., `vecN`, `matNxM`, `texture2D`, etc.)
    - Built-in functions (e.g., `length`, `imageLoad`, `packUnorm4x8`)
    - Includes all [extensions](https://github.com/KhronosGroup/GLSL#extension-specifications-in-this-repository)
    - Fields
- Inline hover documentation for all builtin and extension functions/variables
- Goto Definition
- Support for `#include`
- Formatter


## Requirements

Requires that you have the [`glsl_analyzer`](https://github.com/nolanderc/glsl_analyzer) binary installed.
Precompiled binaries are supplied on the [Releases](https://github.com/nolanderc/glsl_analyzer/releases) page.
