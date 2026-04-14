"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface CocktailGlassProps {
  scale?: number;
  opacity?: number;
}

function CocktailGlass({ scale = 1, opacity = 1 }: CocktailGlassProps) {
  const worldAxisGroupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (worldAxisGroupRef.current) {
      // 繞著畫面的垂直軸 (World Y Axis) 旋轉
      // 這樣即便酒杯是斜的，也會產生「杯口在畫面上方畫圓圈」的旋轉感
      const t = state.clock.elapsedTime || performance.now() / 1000;
      worldAxisGroupRef.current.rotation.y = t * 0.8; 
    }
  });

  const points = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0, -4));
    pts.push(new THREE.Vector2(1.5, -4));
    pts.push(new THREE.Vector2(0.1, -3.8));
    pts.push(new THREE.Vector2(0.1, 0.2));
    pts.push(new THREE.Vector2(0.5, 0.5));
    pts.push(new THREE.Vector2(2.2, 2.5));
    pts.push(new THREE.Vector2(2.0, 4.5));
    return pts;
  }, []);

  return (
    <group scale={[scale, scale, scale]}>
      {/* 第一層：繞世界座標 Y 軸旋轉 (畫面垂直軸) */}
      <group ref={worldAxisGroupRef}>
        {/* 第二層：給予酒杯固定的傾斜角度 (約 20 度) */}
        <group rotation={[0, 0, -Math.PI / 9]}>
          {/* 酒杯本體 */}
          <mesh>
            <latheGeometry args={[points, 64]} />
            <meshPhysicalMaterial 
              color="#D4AF37"
              metalness={1}
              roughness={0.05}
              transmission={0.9}
              thickness={1.5}
              transparent
              opacity={0.7 * opacity}
              envMapIntensity={3}
              clearcoat={1}
            />
          </mesh>
          
          {/* 內層液體 */}
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[1.7, 0.3, 3.5, 32]} />
            <MeshDistortMaterial
              color="#600000"
              speed={4}
              distort={0.4}
              radius={1}
              transparent
              opacity={0.8 * opacity}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

interface ThreeSceneProps {
  scrollScale?: number;
  scrollOpacity?: number;
}

export default function ThreeScene({ scrollScale = 1, scrollOpacity = 1 }: ThreeSceneProps) {
  return (
    <div 
      id="three-canvas-container"
      className="fixed inset-0 pointer-events-none" 
      style={{ position: 'fixed', zIndex: -10 }}
    >
      <Canvas 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 16]} />
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <spotLight position={[15, 20, 10]} angle={0.2} penumbra={1} intensity={2.5} color="#D4AF37" />
        <directionalLight position={[-10, 5, 5]} intensity={0.5} color="#ffffff" />
        
        <CocktailGlass scale={scrollScale} opacity={scrollOpacity} />
        
        <ContactShadows 
          position={[0, -6, 0]} 
          opacity={0.2 * scrollOpacity} 
          scale={25} 
          blur={2.5} 
          far={10} 
          color="#000000" 
        />
      </Canvas>
    </div>
  );
}
