'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef } from 'react';

function GarmentModel({ color = '#c89b3c' }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.5, 1.2, 24]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.6, 1.5, 36]} />
        <meshStandardMaterial color={color} metalness={0.25} roughness={0.5} />
      </mesh>

      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#f8f4e8" metalness={0.2} roughness={0.45} />
      </mesh>
    </group>
  );
}

export default function Product3DPreview({ color }) {
  return (
    <div className="h-[380px] overflow-hidden rounded-2xl border border-accent-200/50 bg-gradient-to-b from-accent-100/50 to-white dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <Canvas camera={{ position: [0, 1.2, 4.2], fov: 35 }} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight intensity={1.2} position={[2, 4, 3]} castShadow />
        <GarmentModel color={color} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
          <circleGeometry args={[3.2, 32]} />
          <meshStandardMaterial color="#e9dcc1" />
        </mesh>
        <OrbitControls enablePan={false} minDistance={3.2} maxDistance={5.8} />
        <Environment preset="city" />
      </Canvas>
      <p className="border-t border-accent-200/50 px-4 py-2 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
        3D preview demo: drag to rotate and zoom.
      </p>
    </div>
  );
}
