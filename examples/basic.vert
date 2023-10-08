#version 330

#include "common.glsl"

layout(location = 0) in vec3 position;

struct Light {
    vec3 color; // color of the light
    float size; // radius of the light
};

void main() {
    const vec4 color = vec4(
            0.3,
            0.5 + 3,
            -3,
            1
        );

    mat3 matrix = mat3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9,
        );

    Rectangle rect = Rectangle(vec2(1, 2), vec2(3, 4));

    vec3 direction = normalize(position);
}
