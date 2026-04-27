"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   FLOW-FIELD PARTICLE SYSTEM
   Curl-noise driven, GPU-rendered points
   ═══════════════════════════════════════════ */
const PARTICLE_COUNT = 2500;

const PARTICLE_VERTEX = /* glsl */ `
attribute float aSize;
attribute float aSeed;
uniform float uTime;
uniform vec2 uMouse;
varying float vAlpha;
varying float vDepth;

void main(){
  vec3 pos = position;
  float t = uTime;
  float s = aSeed;

  // Cheap organic flow field using layered sin/cos waves
  float px = pos.x * 0.18;
  float py = pos.y * 0.18;
  float pz = pos.z * 0.18;
  float slow = t * 0.035;

  // Primary wave — large organic drift
  float fx = sin(py * 1.2 + slow + s * 6.28) * cos(pz * 0.8 + slow * 0.7) * 1.6;
  float fy = cos(px * 1.1 + slow * 0.9 + s * 4.71) * sin(pz * 0.9 + slow * 0.6) * 1.6;
  float fz = sin(px * 0.9 + slow * 0.8) * cos(py * 1.0 + slow * 1.1 + s * 3.14) * 0.8;

  // Secondary detail — smaller ripple
  fx += sin(py * 2.5 + slow * 1.3 + 7.0) * 0.35;
  fy += cos(px * 2.3 + slow * 1.1 + 5.0) * 0.35;
  fz += sin(pz * 2.1 + slow * 1.5 + 3.0) * 0.2;

  pos += vec3(fx, fy, fz);

  // Gentle per-particle oscillation
  pos.x += sin(t * 0.3 + s * 62.83) * 0.12;
  pos.y += cos(t * 0.25 + s * 47.12) * 0.12;

  // Mouse influence — soft push
  vec2 mouseDir = pos.xy - uMouse * 5.0;
  float mouseDist = length(mouseDir);
  if(mouseDist < 3.0 && mouseDist > 0.01){
    float push = (1.0 - mouseDist / 3.0) * 0.5;
    pos.xy += normalize(mouseDir) * push;
  }

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  float depth = -mvPos.z;

  // Size attenuation
  gl_PointSize = aSize * (120.0 / max(depth, 1.0));
  gl_PointSize = clamp(gl_PointSize, 0.3, 3.0);

  // Alpha: depth-based fade
  vAlpha = smoothstep(22.0, 3.0, depth) * (0.12 + s * 0.25);
  vDepth = depth;

  gl_Position = projectionMatrix * mvPos;
}
`;


const PARTICLE_FRAGMENT = /* glsl */ `
precision highp float;
varying float vAlpha;
varying float vDepth;

void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if(d > 1.0) discard;
  float alpha = vAlpha * (1.0 - d * d);

  // Near = brighter white, far = dimmer silver
  vec3 nearCol = vec3(0.85, 0.85, 0.9);
  vec3 farCol = vec3(0.4, 0.4, 0.48);
  float dm = smoothstep(3.0, 16.0, vDepth);
  vec3 color = mix(nearCol, farCol, dm);

  gl_FragColor = vec4(color, alpha);
}
`;

function FlowFieldParticles({ mouse }) {
  const pointsRef = useRef();

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const seeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Wide disc distribution
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.55) * 7;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      sizes[i] = 0.5 + Math.random() * 1.2;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

/* ═══════════════════════════════════════════
   3D LOGO — Matte black + Fresnel edge glow
   ═══════════════════════════════════════════ */
const LOGO_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
void main(){
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;

const LOGO_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vNormal;
varying vec3 vViewDir;
uniform vec3 uEdgeColor;
uniform float uEdgeIntensity;

void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);

  // Fresnel rim glow — stronger
  float fresnel = 1.0 - abs(dot(n, v));
  float rim = pow(fresnel, 2.0);
  float rimFine = pow(fresnel, 5.0);

  // Slightly brighter base for a metallic look
  vec3 base = vec3(0.04);

  // Three-light diffuse for richer surface shading
  vec3 l1 = normalize(vec3(0.5, 1.0, 0.8));
  vec3 l2 = normalize(vec3(-0.6, 0.3, -0.5));
  vec3 l3 = normalize(vec3(0.2, -0.5, 1.0));
  float diff = max(dot(n, l1), 0.0) * 0.12 + max(dot(n, l2), 0.0) * 0.06 + max(dot(n, l3), 0.0) * 0.04;

  // Primary specular highlight — tight
  vec3 halfDir = normalize(l1 + v);
  float spec = pow(max(dot(n, halfDir), 0.0), 60.0) * 0.35;

  // Secondary specular — broader sheen
  vec3 halfDir2 = normalize(l2 + v);
  float spec2 = pow(max(dot(n, halfDir2), 0.0), 20.0) * 0.12;

  // Combine: base + lighting + edge glow + bright edge line + specular
  vec3 color = base + diff;
  color += uEdgeColor * rim * uEdgeIntensity * 1.3;
  color += vec3(1.0) * rimFine * 0.6;
  color += spec + spec2;

  gl_FragColor = vec4(color, 1.0);
}
`;

function LogoPiece({ geometry, edgeColor, edgeIntensity, position: pos = [0, 0, 0] }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uEdgeColor: { value: new THREE.Color(edgeColor) },
          uEdgeIntensity: { value: edgeIntensity },
        },
        vertexShader: LOGO_VERTEX,
        fragmentShader: LOGO_FRAGMENT,
      }),
    [edgeColor, edgeIntensity]
  );

  return <mesh geometry={geometry} material={material} position={pos} />;
}

function LogoGroup({ mouse }) {
  const groupRef = useRef();

  // From the actual Projekts logo SVG icon polygons
  const accentPoints = [
    [45.7, 59.8], [24.34, 47.12], [0, 61.93],
    [0, 121.25], [21.45, 134.1], [21.45, 73.49],
  ];

  const mainPoints = [
    [24.49, 14.63], [45.23, 2.19], [97.38, 32.38],
    [97.19, 90.61], [48.43, 117.72], [48.43, 93.08],
    [75.36, 77.25], [75.36, 44.44],
  ];

  // Build both geometries sharing the same coordinate system, then center together
  const { accentGeo, mainGeo } = useMemo(() => {
    const vbW = 97.38;
    const vbH = 134.1;
    const scale = 3.2 / vbH;
    const depth = 0.55;
    const extrudeSettings = {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 3,
    };

    function makeShape(pts) {
      const shape = new THREE.Shape();
      const cx = vbW / 2;
      const cy = vbH / 2;
      for (let i = 0; i < pts.length; i++) {
        const x = (pts[i][0] - cx) * scale;
        const y = -(pts[i][1] - cy) * scale;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      return shape;
    }

    const ag = new THREE.ExtrudeGeometry(makeShape(accentPoints), extrudeSettings);
    ag.translate(0, 0, -depth / 2); // center Z
    ag.computeVertexNormals();

    const mg = new THREE.ExtrudeGeometry(makeShape(mainPoints), extrudeSettings);
    mg.translate(0, 0, -depth / 2); // center Z
    mg.computeVertexNormals();

    return { accentGeo: ag, mainGeo: mg };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // Mouse-driven rotation only — full 360° range
    const targetY = mouse.current.x * Math.PI; // -π to π
    const targetX = -mouse.current.y * Math.PI * 0.5; // -π/2 to π/2

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04
    );
  });

  return (
    <group ref={groupRef} scale={1.2}>
      <LogoPiece
        geometry={accentGeo}
        edgeColor="#ffffff"
        edgeIntensity={1.0}
        position={[0, 0, 0.01]}
      />
      <LogoPiece
        geometry={mainGeo}
        edgeColor="#c8c8e0"
        edgeIntensity={0.75}
        position={[0, 0, 0]}
      />
      {/* Volumetric glow from center */}
      <pointLight position={[0, 0, 2]} intensity={6} color="#e8e8ff" distance={10} decay={2} />
      <pointLight position={[0, 0, -1.5]} intensity={3} color="#d0d0e8" distance={8} decay={2} />
    </group>
  );
}

/* Camera is fixed — logo handles all mouse interaction */

/* ═══════════════════════════════════════════
   MAIN SCENE EXPORT
   ═══════════════════════════════════════════ */
export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) {
    return (
      <div
        className="hero-canvas"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, #151518 0%, #0a0a0a 70%)",
        }}
      />
    );
  }

  return (
    <div className="hero-canvas">
      <Canvas
        camera={{ position: [0, 0.1, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#0a0a0a" }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 12, 28]} />

        <ambientLight intensity={0.08} />
        <directionalLight position={[3, 4, 4]} intensity={1.8} color="#e8e8f4" />
        <directionalLight position={[-2, 3, -3]} intensity={0.6} color="#a0a0c0" />
        <pointLight position={[-3, 2, -2]} intensity={0.8} color="#8888a0" distance={12} />

        <LogoGroup mouse={mouse} />
        <FlowFieldParticles mouse={mouse} />


      </Canvas>
    </div>
  );
}
