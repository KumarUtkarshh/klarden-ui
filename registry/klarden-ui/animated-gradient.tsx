"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface CustomConfig {
  color1?: string;
  color2?: string;
  color3?: string;
  direction?: number;
  speed1?: number;
  speed2?: number;
  frequency1?: number;
  frequency2?: number;
  noiseStrength?: number;
  amplitude1?: number;
  amplitude2?: number;
  octaves?: number;
}

interface AnimatedGradientProps {
  className?: string;
  variant?: "mist" | "lava" | "prism" | "plasma" | "pulse" | "vortex" | "custom";
  speed?: number;
  opacity?: number;
  config?: CustomConfig;
  children?: React.ReactNode;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
};

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const MIST_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  #define PI 3.14159265359

  float wave(float x, float y, float t) {
    return sin(x * 2.5 + y * 1.8 + t) * 0.5 + 0.5;
  }
  float wave2(float x, float y, float t) {
    return sin(x * 4.0 - y * 2.5 + t * 1.3) * 0.5 + 0.5;
  }
  float wave3(float x, float y, float t) {
    return sin(x * 1.5 + y * 3.2 + t * 0.7 + PI * 0.5) * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    float t = u_time * 0.25;
    
    float n1 = wave(uv.x, uv.y, t);
    float n2 = wave2(uv.x + n1 * 0.5, uv.y - n1 * 0.3, t * 1.2);
    float n3 = wave3(uv.x - n2 * 0.4, uv.y + n2 * 0.5, t * 0.8);
    
    float flow = uv.x * 0.5 + uv.y * 0.5 + t;
    float w1 = sin(flow * 4.0 + n1 * 3.0) * 0.5 + 0.5;
    float w2 = sin(flow * 6.0 - n2 * 4.0 + PI) * 0.5 + 0.5;
    float w3 = sin(flow * 3.0 + n3 * 2.5 + PI * 0.25) * 0.5 + 0.5;
    
    float b1 = pow(w1, 3.0) * pow(w2, 1.5);
    float b2 = pow(w2, 2.0) * pow(w3, 2.0) * 0.7;
    float b3 = pow(w3, 3.5) * 0.5;
    
    float intensity = b1 * 0.8 + b2 * 0.6 + b3 * 0.5;
    
    vec2 center = vec2(0.5 * aspect, 0.5);
    float dist = length(uv - center);
    intensity += (n1 * 0.15 + n2 * 0.1) * (1.0 - smoothstep(0.0, 1.0, dist));
    
    vec3 col1 = vec3(0.98, 0.08, 0.51); // Hot pink
    vec3 col2 = vec3(0.55, 0.09, 0.79); // Purple
    vec3 col3 = vec3(0.12, 0.05, 0.38); // Deep Indigo
    vec3 col4 = vec3(0.85, 0.23, 0.64); // Violet/Magenta
    
    vec3 col = mix(col1, col2, n1);
    col = mix(col, col3, n2 * 0.5);
    col = mix(col, col4, w3 * 0.3);
    
    col = col * (intensity * 1.5 + 0.1);
    col = pow(col, vec3(0.85));
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const LAVA_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  #define PI 3.14159265359

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Limited to 2 octaves to eliminate jagged details and ensure broad, glassy waves
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 2; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    // Smooth upward animation speed
    float t = u_time * 0.22;
    
    // Slow gentle sideways sway of the flame body
    float sway = sin(uv.x * 2.5 + u_time * 0.45) * 0.07;
    
    // Domain warping noise layers (wider waves for blurry glass look)
    vec2 q = vec2(0.0);
    q.x = fbm(uv * 2.0 + vec2(0.0, -t));
    q.y = fbm(uv * 2.0 + vec2(t * 0.35, -t * 0.85));
    
    vec2 r = vec2(0.0);
    r.x = fbm(uv * 2.2 + 2.8 * q + vec2(1.7, -t * 1.5));
    r.y = fbm(uv * 2.2 + 2.8 * q + vec2(8.3, -t * 1.25));
    
    // Soft low-frequency noise (completely smoothed out)
    float f = fbm(uv * 1.05 + 1.65 * r);
    
    // Vertical flame base offset with swaying peaks
    float fire = (1.0 - (uv.y + sway)) * 1.35; 
    
    // Volumetric flame thresholds with extremely wide smoothstep windows for a blurry look
    float flameIntensity = fire + f * 1.5 - 0.72;
    
    float flame = smoothstep(-0.25, 0.95, flameIntensity);
    float orangeGlow = smoothstep(0.12, 0.98, flameIntensity);
    float goldCore = smoothstep(0.38, 1.0, fire + f * 0.72 - 0.42);
    
    // Soft glowing volumetric smoke tips
    float smoke = smoothstep(-0.3, 0.45, flameIntensity) * (1.0 - smoothstep(0.45, 0.95, flameIntensity));
    
    // Warm fire color definitions (no harsh bright yellows or whites!)
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 deepRed = vec3(0.55, 0.015, 0.0);
    vec3 brightOrange = vec3(0.92, 0.25, 0.0);
    vec3 goldenOrange = vec3(0.96, 0.42, 0.02);
    
    // Blending volumetric color layers for a blurry glass bonfire effect
    vec3 col = mix(black, deepRed, flame);
    col = mix(col, brightOrange, orangeGlow);
    col = mix(col, goldenOrange, goldCore);
    
    // Volumetric smoke tip glow for glowing depth
    col += deepRed * smoke * 0.35;
    
    // Edge hot glow edge highlighting (wider transition for blurry glow)
    float edge = smoothstep(0.25, 0.55, f) * (1.0 - smoothstep(0.55, 0.85, f));
    col += edge * brightOrange * 0.18 * (1.0 - uv.y);
    
    // Contrast boost
    col = pow(col, vec3(0.85));
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const PRISM_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  #define PI 3.14159265359

  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    float t = u_time * 0.08;
    
    vec2 p = uv - vec2(0.5 * aspect, 0.5);
    float r = length(p);
    float theta = atan(p.y, p.x);
    
    float wave1 = sin(uv.x * 3.0 + t) * 0.5 + 0.5;
    float wave2 = sin(uv.y * 3.0 - t * 1.5) * 0.5 + 0.5;
    float wave3 = sin(theta * 3.0 + t * 2.0) * 0.5 + 0.5;
    
    float hue = fract(t + r * 0.25 + wave1 * 0.15 + wave2 * 0.1 + wave3 * 0.05);
    
    float sat = 0.85 + 0.15 * sin(t * 3.0 + r * PI);
    float light = 0.45 + 0.15 * sin(theta - t + r * 4.0);
    
    vec3 rgb = hsl2rgb(vec3(hue, sat, light));
    
    float spec = pow(max(0.0, sin(uv.x * 10.0 + uv.y * 10.0 + t * 5.0)), 12.0) * 0.25;
    rgb += vec3(spec);
    
    rgb *= (1.0 - r * 0.35);
    
    gl_FragColor = vec4(rgb, 1.0);
  }
`;

const PLASMA_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    float t = u_time * 0.4;
    
    float x1 = uv.x * 2.0;
    float y1 = uv.y * 2.0;
    
    float v1 = sin(x1 + t);
    float v2 = sin(y1 + t * 0.5);
    float v3 = sin(x1 + y1 + t);
    
    vec2 temp = uv - 0.5 * vec2(aspect, 1.0);
    float v4 = sin(length(temp) * 8.0 - t);
    
    float plasma = (v1 + v2 + v3 + v4) / 4.0;
    
    vec3 electricBlue = vec3(0.0, 0.3, 1.0);
    vec3 neonPurple = vec3(0.5, 0.0, 1.0);
    vec3 cyan = vec3(0.0, 0.95, 1.0);
    vec3 magenta = vec3(1.0, 0.0, 0.6);
    
    vec3 col = mix(electricBlue, neonPurple, sin(plasma * 3.1415) * 0.5 + 0.5);
    col = mix(col, cyan, cos(plasma * 5.0) * 0.3 + 0.3);
    col = mix(col, magenta, smoothstep(0.2, 0.7, sin(plasma * 8.0 + t)) * 0.25);
    
    float glow = pow(1.0 - abs(plasma), 8.0) * 0.4;
    col += cyan * glow;
    
    col = col * col * 1.5;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const PULSE_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  #define PI 3.14159265359

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    vec2 center = vec2(0.5 * aspect, 0.5);
    vec2 d = uv - center;
    float dist = length(d);
    
    float t = u_time * 0.5;
    
    float pulse = sin(t * 1.5) * 0.5 + 0.5;
    
    float angle = atan(d.y, d.x);
    float deform = sin(angle * 5.0 + t) * 0.15 * (1.0 - smoothstep(0.4, 0.8, dist));
    float distDeformed = dist + deform;
    
    float ringIntensity = pow(sin(distDeformed * 15.0 - t * 2.5) * 0.5 + 0.5, 4.0);
    
    vec3 deepRed = vec3(0.4, 0.02, 0.0);
    vec3 amber = vec3(0.95, 0.4, 0.05);
    vec3 gold = vec3(1.0, 0.8, 0.2);
    vec3 softBg = vec3(0.08, 0.02, 0.04);
    
    vec3 col = mix(softBg, deepRed, 1.0 - smoothstep(0.1, 0.7, dist));
    col = mix(col, amber, ringIntensity * (0.8 - dist * 0.5));
    col = mix(col, gold, pow(ringIntensity, 2.0) * 0.4 * (1.0 - dist));
    
    float core = 1.0 - smoothstep(0.0, 0.15 + 0.05 * pulse, dist);
    col += gold * core * 0.9;
    
    col *= (1.0 - dist * 0.5);
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const VORTEX_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  #define PI 3.14159265359

  float noise(in vec2 p) {
    return sin(p.x * 2.0) * sin(p.y * 2.0);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    vec2 center = vec2(0.5 * aspect, 0.5);
    vec2 d = uv - center;
    float r = length(d);
    float theta = atan(d.y, d.x);
    
    float t = u_time * 0.35;
    
    float spiral = theta + 4.5 / (r + 0.08) - t * 2.0;
    
    float w1 = sin(spiral * 2.0) * 0.5 + 0.5;
    float w2 = sin(spiral * 4.0 + PI * 0.5) * 0.5 + 0.5;
    
    float rNoise = noise(vec2(r * 4.0 - t, theta * 2.0)) * 0.12;
    float wCombined = mix(w1, w2, 0.4) + rNoise;
    
    float intensity = pow(wCombined, 3.0) * (1.0 - smoothstep(0.0, 0.9, r));
    
    vec3 spaceBlack = vec3(0.01, 0.02, 0.06);
    vec3 royalBlue = vec3(0.05, 0.15, 0.7);
    vec3 intenseCyan = vec3(0.0, 0.85, 0.95);
    vec3 emerald = vec3(0.05, 0.9, 0.6);
    
    vec3 col = mix(spaceBlack, royalBlue, intensity * 0.8 + r * 0.2);
    col = mix(col, intenseCyan, pow(intensity, 2.0) * 0.9);
    col = mix(col, emerald, pow(intensity, 4.0) * 0.5);
    
    float centerGlow = 1.0 - smoothstep(0.0, 0.05, r);
    col += intenseCyan * centerGlow * 1.2;
    
    col += emerald * pow(intensity, 5.0) * 0.3;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const CUSTOM_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Custom configuration uniforms
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_direction;
  uniform float u_speed1;
  uniform float u_speed2;
  uniform float u_frequency1;
  uniform float u_frequency2;
  uniform float u_noiseStrength;
  uniform float u_amplitude1;
  uniform float u_amplitude2;
  uniform float u_octaves;

  #define PI 3.14159265359

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p, int oct) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
      if (i >= oct) break;
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    float rad = u_direction * PI / 180.0;
    vec2 dir = vec2(cos(rad), sin(rad));

    float t1 = u_time * u_speed1 * 0.01;
    float t2 = u_time * u_speed2 * 0.01;

    int oct = int(clamp(u_octaves, 1.0, 4.0));
    
    vec2 q = vec2(0.0);
    q.x = fbm(uv * (u_frequency1 * 0.25) + dir * t1, oct);
    q.y = fbm(uv * (u_frequency1 * 0.25) - dir * t1, oct);

    vec2 r = vec2(0.0);
    r.x = fbm(uv * (u_frequency2 * 0.25) + (u_noiseStrength * 0.25) * q + dir * t2 + vec2(1.7, 9.2), oct);
    r.y = fbm(uv * (u_frequency2 * 0.25) + (u_noiseStrength * 0.25) * q - dir * t2 + vec2(8.3, 2.8), oct);

    float f = fbm(uv * 2.5 + (u_amplitude1 * 0.2) * r, oct);

    vec3 col = mix(u_color1, u_color2, f);
    col = mix(col, u_color3, clamp(length(q) * (u_amplitude2 * 0.2) * 0.1, 0.0, 1.0));

    vec2 center = vec2(0.5 * aspect, 0.5);
    float d = length(uv - center);
    col *= (1.0 - d * 0.3);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const FRAGMENT_SHADERS = {
  mist: MIST_SHADER,
  lava: LAVA_SHADER,
  prism: PRISM_SHADER,
  plasma: PLASMA_SHADER,
  pulse: PULSE_SHADER,
  vortex: VORTEX_SHADER,
  custom: CUSTOM_SHADER,
} as const;

export function AnimatedGradient({
  className,
  variant = "mist",
  speed = 1,
  opacity = 1,
  config,
  children,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShaderSource =
      FRAGMENT_SHADERS[variant] || FRAGMENT_SHADERS.mist;
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // Custom configuration uniforms
    let color1Loc: WebGLUniformLocation | null = null;
    let color2Loc: WebGLUniformLocation | null = null;
    let color3Loc: WebGLUniformLocation | null = null;
    let dirLoc: WebGLUniformLocation | null = null;
    let speed1Loc: WebGLUniformLocation | null = null;
    let speed2Loc: WebGLUniformLocation | null = null;
    let freq1Loc: WebGLUniformLocation | null = null;
    let freq2Loc: WebGLUniformLocation | null = null;
    let noiseStrLoc: WebGLUniformLocation | null = null;
    let amp1Loc: WebGLUniformLocation | null = null;
    let amp2Loc: WebGLUniformLocation | null = null;
    let octLoc: WebGLUniformLocation | null = null;

    if (variant === "custom") {
      color1Loc = gl.getUniformLocation(program, "u_color1");
      color2Loc = gl.getUniformLocation(program, "u_color2");
      color3Loc = gl.getUniformLocation(program, "u_color3");
      dirLoc = gl.getUniformLocation(program, "u_direction");
      speed1Loc = gl.getUniformLocation(program, "u_speed1");
      speed2Loc = gl.getUniformLocation(program, "u_speed2");
      freq1Loc = gl.getUniformLocation(program, "u_frequency1");
      freq2Loc = gl.getUniformLocation(program, "u_frequency2");
      noiseStrLoc = gl.getUniformLocation(program, "u_noiseStrength");
      amp1Loc = gl.getUniformLocation(program, "u_amplitude1");
      amp2Loc = gl.getUniformLocation(program, "u_amplitude2");
      octLoc = gl.getUniformLocation(program, "u_octaves");
    }

    const startTime = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, elapsed * speed);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      if (variant === "custom") {
        const c = config || {};
        const col1 = hexToRgb(c.color1 || "#8b5cf6");
        const col2 = hexToRgb(c.color2 || "#ec4899");
        const col3 = hexToRgb(c.color3 || "#3b82f6");

        gl.uniform3f(color1Loc, col1[0], col1[1], col1[2]);
        gl.uniform3f(color2Loc, col2[0], col2[1], col2[2]);
        gl.uniform3f(color3Loc, col3[0], col3[1], col3[2]);
        gl.uniform1f(dirLoc, c.direction ?? 0);
        gl.uniform1f(speed1Loc, c.speed1 ?? 20);
        gl.uniform1f(speed2Loc, c.speed2 ?? 20);
        gl.uniform1f(freq1Loc, c.frequency1 ?? 10);
        gl.uniform1f(freq2Loc, c.frequency2 ?? 10);
        gl.uniform1f(noiseStrLoc, c.noiseStrength ?? 10);
        gl.uniform1f(amp1Loc, c.amplitude1 ?? 15);
        gl.uniform1f(amp2Loc, c.amplitude2 ?? 15);
        gl.uniform1f(octLoc, c.octaves ?? 2);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [variant, speed, config]);

  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity }} />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}
