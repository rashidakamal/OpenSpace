/*****************************************************************************************
 *                                                                                       *
 * OpenSpace                                                                             *
 *                                                                                       *
 * Copyright (c) 2014-2019                                                               *
 *                                                                                       *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this  *
 * software and associated documentation files (the "Software"), to deal in the Software *
 * without restriction, including without limitation the rights to use, copy, modify,    *
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to    *
 * permit persons to whom the Software is furnished to do so, subject to the following   *
 * conditions:                                                                           *
 *                                                                                       *
 * The above copyright notice and this permission notice shall be included in all copies *
 * or substantial portions of the Software.                                              *
 *                                                                                       *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,   *
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A         *
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT    *
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  *
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE  *
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                                         *
 ****************************************************************************************/

#version __CONTEXT__

uniform sampler2D exitColorTexture;
uniform sampler2D exitDepthTexture;
uniform sampler2D mainDepthTexture;

uniform bool insideRaycaster;
uniform vec3 cameraPosInRaycaster;
uniform vec2 windowSize;

#include "blending.glsl"
#include "rand.glsl"
#include "floatoperations.glsl"

#for id, helperPath in helperPaths
#include <#{helperPath}>
#endfor

#include <#{raycastPath}>

out vec4 finalColor;

#define ALPHA_LIMIT 0.99
#define RAYCAST_MAX_STEPS 1000

#include <#{getEntryPath}>

void main() {
    vec2 texCoord = vec2(gl_FragCoord.xy / windowSize);

    vec4 exitColorTexture = texture(exitColorTexture, texCoord);

    // If we don't have an exit, discard the ray
    if (exitColorTexture.a < 1.0 || exitColorTexture.rgb == vec3(0.0)) {
        discard;
    }

    // Fetch exit point from texture
    vec3 exitPos = exitColorTexture.rgb;
    float exitDepth =  denormalizeFloat(texture(exitDepthTexture, texCoord).x);

    float jitterFactor = 0.5 + 0.5 * rand(gl_FragCoord.xy); // should be between 0.5 and 1.0

    vec3 entryPos;
    float entryDepth;
    getEntry(entryPos, entryDepth);
    // If we don't have an entry, discard the ray
    if (entryPos == vec3(0.0)) {
        discard;
    }

    vec3 position = entryPos;
    vec3 diff = exitPos - entryPos;

    vec3 direction = normalize(diff);
    float raycastDepth = length(diff);

    float geoDepth = denormalizeFloat(texelFetch(mainDepthTexture, ivec2(gl_FragCoord), 0).x);
    float geoRatio = clamp((geoDepth - entryDepth) / (exitDepth - entryDepth), 0.0, 1.0);
    raycastDepth = geoRatio * raycastDepth;

    float currentDepth = 0.0;
    float nextStepSize = stepSize#{id}(position, direction);
    float currentStepSize;
    float previousJitterDistance = 0.0;

    int nSteps = 0;

    int sampleIndex = 0;
    float opacityDecay = 1.0;

    vec3 accumulatedColor = vec3(0.0);
    vec3 accumulatedAlpha = vec3(0.0);


    for (nSteps = 0; 
        (accumulatedAlpha.r < ALPHA_LIMIT || accumulatedAlpha.g < ALPHA_LIMIT || 
         accumulatedAlpha.b < ALPHA_LIMIT) && nSteps < RAYCAST_MAX_STEPS; 
         ++nSteps) 
    {
        if (nextStepSize < raycastDepth / 10000000000.0) {
            break;
        }

        currentStepSize = nextStepSize;
        currentDepth += currentStepSize;

        float jitteredStepSize = currentStepSize * jitterFactor;
        vec3 jitteredPosition = position + direction*jitteredStepSize;
        position += direction * currentStepSize;

        sample#{id}(jitteredPosition, direction, accumulatedColor, accumulatedAlpha, nextStepSize);
        float sampleDistance = jitteredStepSize + previousJitterDistance;

        previousJitterDistance = currentStepSize - jitteredStepSize;

        float maxStepSize = raycastDepth - currentDepth;
        nextStepSize = min(nextStepSize, maxStepSize);
    }

    finalColor = vec4(accumulatedColor, (accumulatedAlpha.r + accumulatedAlpha.g + accumulatedAlpha.b) / 3);

    finalColor.rgb /= finalColor.a ;
    gl_FragDepth = normalizeFloat(entryDepth);
}
