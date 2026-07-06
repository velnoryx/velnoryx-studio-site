import { useRef, useMemo, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
// The intro section occupies the first ~22% of total page scroll (200vh / ~900vh total).
// We want the Earth zoom to fill the full intro track so it feels continuous.
const INTRO_SCROLL_END = 0.22; // normalized scroll where intro ends

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Detailed Earth ───────────────────────────────────────────────────────────
function DetailedEarth({
  radius,
  scrollProgressRef,
}: {
  radius: number;
  scrollProgressRef: MutableRefObject<number>;
}) {
  const particlesRef = useRef<THREE.Points>(null);

  const texture = useTexture('/textures/earth_glow.jpg');

  const particlesCount = 1500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius + 0.18;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [radius]);

  // Custom circular-mask shader
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uOpacity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uOpacity;
        void main() {
          vec2 uv = vUv - 0.5;
          float dist = length(uv);
          if (dist > 0.5) discard;
          vec4 color = texture2D(uTexture, vUv);
          float alpha = smoothstep(0.5, 0.47, dist) * uOpacity;
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, [texture]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const sp = scrollProgressRef.current;

    // Normalized intro progress [0, 1] clamped to the intro scroll window.
    const introProgress = Math.min(sp / INTRO_SCROLL_END, 1);

    // Particles slow-orbit over time; add a gentle scroll-driven tilt so they
    // respond to scroll without snapping. Pure additive — no lerp fighting time.
    particlesRef.current.rotation.y = time * 0.04 + introProgress * 1.8;
    particlesRef.current.rotation.x = time * 0.015;
  });

  return (
    <group>
      <mesh>
        <planeGeometry args={[radius * 2, radius * 2]} />
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#fcd34d"
          transparent
          opacity={0.45}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ─── Scroll Zoom + Opacity Group ──────────────────────────────────────────────
function ScrollZoomGroup({
  scrollProgressRef,
}: {
  scrollProgressRef: MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  // Track a smooth-scroll value to avoid jitter from per-frame sp reads.
  const smoothSp = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    const sp = scrollProgressRef.current;

    // Smooth the raw scroll value with a gentle lerp so tiny micro-jitters in
    // the scroll position don't manifest as jitter in 3-D scale.
    // The lerp factor (0.12) is fast enough to feel instant but eliminates jitter.
    smoothSp.current = lerp(smoothSp.current, sp, 0.12);
    const ssp = smoothSp.current;

    // ── Normalized intro progress [0, 1] ──
    // At ssp=0            → introProgress=0 (full-screen hero)
    // At ssp=INTRO_SCROLL_END → introProgress=1 (end of intro)
    const introProgress = Math.min(ssp / INTRO_SCROLL_END, 1);

    // ── Scale: Earth zooms from 1.0→ 2.8 through the entire intro track ──
    // easeInOut curve so both ends feel smooth.
    const eased = introProgress < 0.5
      ? 2 * introProgress * introProgress
      : 1 - Math.pow(-2 * introProgress + 2, 2) / 2;
    let scale = 1.0 + eased * 1.8; // 1.0 → 2.8

    // Zoom back out to 1.2 during the outro for a beautiful overview
    if (ssp > 0.85) {
      const scaleFade = THREE.MathUtils.smoothstep(ssp, 0.85, 0.98);
      scale = lerp(2.8, 1.2, scaleFade);
    }
    groupRef.current.scale.setScalar(scale);

    // ── Opacity: fade globe out as user scrolls into chapter content ──
    // Keep a subtle ambient presence (8%) for mid-sections, and fade back up for the Outro.
    let globeOpacity = 1;
    if (ssp < INTRO_SCROLL_END * 1.15) {
      const fade = THREE.MathUtils.smoothstep(ssp, INTRO_SCROLL_END * 0.85, INTRO_SCROLL_END * 1.15);
      globeOpacity = lerp(1.0, 0.08, fade);
    } else if (ssp < 0.85) {
      globeOpacity = 0.08;
    } else {
      const fade = THREE.MathUtils.smoothstep(ssp, 0.85, 0.98);
      globeOpacity = lerp(0.08, 0.8, fade);
    }

    // Apply opacity via group — affects all children
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.Material;
        if (mat) {
          if ('uniforms' in mat) {
            const shaderMat = mat as THREE.ShaderMaterial;
            if (shaderMat.uniforms && shaderMat.uniforms.uOpacity) {
              shaderMat.uniforms.uOpacity.value = globeOpacity;
            }
          }
          if ('opacity' in mat) {
            (mat as THREE.MeshStandardMaterial).opacity = globeOpacity;
            (mat as THREE.MeshStandardMaterial).transparent = true;
          }
        }
      }
      if ((child as THREE.Points).isPoints) {
        const mat = (child as THREE.Points).material as THREE.PointsMaterial;
        if (mat) mat.opacity = globeOpacity * 0.45;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <DetailedEarth radius={2.2} scrollProgressRef={scrollProgressRef} />
    </group>
  );
}

// ─── Scene export ─────────────────────────────────────────────────────────────
interface GlobeSceneProps {
  scrollProgressRef: MutableRefObject<number>;
}

export default function GlobeScene({ scrollProgressRef }: GlobeSceneProps) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.8} />
        <ScrollZoomGroup scrollProgressRef={scrollProgressRef} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
