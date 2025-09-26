import React, { useRef, useEffect } from 'react';

const FluidCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // Vertex shader - simple passthrough
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader for fluid paint effect
  const fragmentShaderSource = `
    precision mediump float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 v_texCoord;
    
    // Improved noise function
    vec2 hash22(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      
      return mix(mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                     dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                 mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                     dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      
      for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    // Enhanced color palette for vibrant paint colors
    vec3 palette(float t) {
      // Create vibrant, paint-like colors
      vec3 a = vec3(0.8, 0.5, 0.4);
      vec3 b = vec3(0.2, 0.4, 0.2);
      vec3 c = vec3(2.0, 1.0, 1.0);
      vec3 d = vec3(0.0, 0.25, 0.25);
      
      return a + b * cos(6.28318 * (c * t + d));
    }
    
    // Distance function for organic blob shapes
    float sdfBlob(vec2 p, float r) {
      return length(p) - r;
    }
    
    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
      vec2 mouse = (u_mouse - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
      
      float time = u_time * 0.3;
      
      // Create organic flowing motion
      vec2 q = vec2(fbm(uv + vec2(0.0, 0.0)),
                    fbm(uv + vec2(5.2, 1.3)));
      
      vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + 0.15 * time),
                    fbm(uv + 4.0 * q + vec2(8.3, 2.8) + 0.126 * time));
      
      // Mouse interaction creates paint spills
      float mouseInfluence = 1.0 - smoothstep(0.0, 1.2, length(uv - mouse));
      vec2 mouseDistortion = (uv - mouse) * mouseInfluence * 0.8;
      
      // Create multiple paint layers with different properties
      float paint1 = fbm(uv + r + time * 0.5 + mouseDistortion * 2.0);
      float paint2 = fbm(uv * 2.0 + q + time * 0.3 + mouseDistortion);
      float paint3 = fbm(uv * 0.5 + r * 2.0 + time * 0.7);
      
      // Combine paint layers
      float paintMix = paint1 * 0.5 + paint2 * 0.3 + paint3 * 0.2;
      paintMix += mouseInfluence * 0.8;
      
      // Create organic blob shapes
      vec2 blobCenter1 = vec2(sin(time * 0.8) * 0.3, cos(time * 0.6) * 0.4);
      vec2 blobCenter2 = vec2(cos(time * 0.5) * 0.5, sin(time * 0.9) * 0.3);
      
      float blob1 = 1.0 - smoothstep(0.0, 0.8, sdfBlob(uv - blobCenter1, 0.4 + sin(time) * 0.1));
      float blob2 = 1.0 - smoothstep(0.0, 0.6, sdfBlob(uv - blobCenter2, 0.3 + cos(time * 1.3) * 0.1));
      
      // Blend blobs with noise
      float finalPattern = paintMix + blob1 * 0.6 + blob2 * 0.4;
      
      // Mouse creates ripple effects
      float ripple = sin(length(uv - mouse) * 10.0 - time * 8.0) * mouseInfluence * 0.2;
      finalPattern += ripple;
      
      // Color mapping with enhanced vibrancy
      float colorIndex = finalPattern + time * 0.1;
      vec3 color1 = palette(colorIndex);
      vec3 color2 = palette(colorIndex + 0.3);
      vec3 color3 = palette(colorIndex + 0.6);
      
      // Blend multiple colors for paint spill effect
      vec3 finalColor = mix(color1, color2, smoothstep(0.0, 1.0, paint1));
      finalColor = mix(finalColor, color3, smoothstep(0.0, 1.0, paint2) * 0.5);
      
      // Add mouse-influenced color variations
      vec3 mouseColor = palette(colorIndex + mouseInfluence * 3.0);
      finalColor = mix(finalColor, mouseColor, mouseInfluence * 0.7);
      
      // Enhance vibrancy and add organic edges
      finalColor *= 1.2;
      finalColor = smoothstep(0.0, 1.0, finalColor);
      
      // Soft alpha for natural blending
      float alpha = smoothstep(0.0, 1.0, finalPattern) * 0.6;
      alpha += mouseInfluence * 0.3;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  };

  const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Create shaders and program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    if (!program) return;

    // Set up geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get uniform and attribute locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseUniformLocation = gl.getUniformLocation(program, 'u_mouse');

    // Resize canvas and viewport
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth * window.devicePixelRatio;
      const displayHeight = canvas.clientHeight * window.devicePixelRatio;
      
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    // Mouse tracking
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (event.clientX - rect.left) * window.devicePixelRatio;
      mouseRef.current.y = (rect.height - (event.clientY - rect.top)) * window.devicePixelRatio;
    };

    // Touch tracking for mobile
    const handleTouch = (event) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0] || event.changedTouches[0];
      mouseRef.current.x = (touch.clientX - rect.left) * window.devicePixelRatio;
      mouseRef.current.y = (rect.height - (touch.clientY - rect.top)) * window.devicePixelRatio;
    };

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016; // Roughly 60fps
      resizeCanvas();

      // Clear and set up for drawing
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Use our shader program
      gl.useProgram(program);

      // Bind position attribute
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      // Set uniforms
      gl.uniform1f(timeUniformLocation, timeRef.current);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseUniformLocation, mouseRef.current.x, mouseRef.current.y);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('resize', resizeCanvas);
      
      // Clean up WebGL resources
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{
        mixBlendMode: 'screen',
        opacity: 0.9,
        filter: 'blur(0.5px)',
      }}
    />
  );
};

export default FluidCanvas;