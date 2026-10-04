"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function buildParticleField(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.5 + Math.random() * 0.5);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function ParticleField({ count, radius }: { count: number; radius: number }) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => buildParticleField(count, radius), [count, radius]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.025;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#67e8f9"
          transparent
          opacity={0.55}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function FloatingObjects({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const icoRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const octRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.12;
      icoRef.current.rotation.y += delta * 0.16;
      icoRef.current.position.y = Math.sin(t * 0.4) * 0.25;
      icoRef.current.rotation.y += (pointer.current.x * 0.3 - icoRef.current.rotation.y) * 0.01;
    }
    if (knotRef.current) {
      knotRef.current.rotation.x -= delta * 0.08;
      knotRef.current.rotation.z += delta * 0.1;
      knotRef.current.position.y = 1.4 + Math.cos(t * 0.5) * 0.2;
    }
    if (octRef.current) {
      octRef.current.rotation.y += delta * 0.2;
      octRef.current.position.y = -1.3 + Math.sin(t * 0.6 + 1) * 0.2;
    }
  });

  return (
    <>
      <mesh ref={icoRef} position={[1.6, 0, -0.5]}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshPhysicalMaterial
          color="#0e7490"
          emissive="#22d3ee"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.6}
          transmission={0.35}
          thickness={1.2}
          wireframe={false}
        />
      </mesh>
      <mesh ref={knotRef} position={[-2, 1.4, -1.2]} scale={0.42}>
        <torusKnotGeometry args={[1, 0.32, 128, 24]} />
        <meshStandardMaterial
          color="#1d4ed8"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
      <mesh ref={octRef} position={[-1.8, -1.3, 0.4]} scale={0.55}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#67e8f9"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.5}
          wireframe
        />
      </mesh>
    </>
  );
}

function Scene({ mobile }: { mobile: boolean }) {
  const { size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const rig = useRef<THREE.Group>(null);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current = {
        x: (e.clientX / size.width) * 2 - 1,
        y: (e.clientY / size.height) * 2 - 1,
      };
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [size]);

  useFrame(() => {
    if (!rig.current) return;
    rig.current.rotation.y += (pointer.current.x * 0.35 - rig.current.rotation.y) * 0.04;
    rig.current.rotation.x += (-pointer.current.y * 0.2 - rig.current.rotation.x) * 0.04;
  });

  return (
    <>
      <fog attach="fog" args={["#0a0b1e", 4, 11]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[4, 3, 4]} color="#67e8f9" intensity={22} distance={14} />
      <pointLight position={[-4, -2, 2]} color="#a78bfa" intensity={18} distance={14} />
      <pointLight position={[0, -4, 3]} color="#f9a8d4" intensity={10} distance={12} />
      <group ref={rig}>
        <ParticleField count={mobile ? 40 : 90} radius={4.2} />
        <FloatingObjects pointer={pointer} />
      </group>
    </>
  );
}

export default function NeuralScene3D() {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading window is only possible client-side after mount
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMobile(window.innerWidth < 768);
    setReady(true);
  }, []);

  if (!ready) return null;

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.2),transparent_60%)]" />
    );
  }

  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, mobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene mobile={mobile} />
      </Canvas>
    </div>
  );
}
