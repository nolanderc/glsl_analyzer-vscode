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


### Screenshots

#### Autocompletion
![completion](https://github.com/nolanderc/glsl_analyzer-vscode/blob/main/screenshots/completion.gif)

#### Formatting
![formatting](https://github.com/nolanderc/glsl_analyzer-vscode/blob/main/screenshots/formatting.gif)

#### Goto-Definition
![goto definition](https://github.com/nolanderc/glsl_analyzer-vscode/blob/main/screenshots/goto-definition.gif)


## Requirements

Automatically downloads and installs the latest
[`glsl_analyzer`](https://github.com/nolanderc/glsl_analyzer) (Linux, Windows and macOS).

If your platform is not supported, or you want to build from source, follow the instructions
[here](https://github.com/nolanderc/glsl_analyzer). Then, set the `glsl-analyzer.path` setting to
the location of your executable.
