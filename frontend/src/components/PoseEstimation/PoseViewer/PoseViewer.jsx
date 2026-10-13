import "./PoseViewer.css";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

function SatelliteModel() {
  const { scene } = useGLTF("/models/satellite.glb");
  const modelRef = useRef();

  useEffect(() => {
    console.log("[PoseViewer Diagnostic] satellite.glb successfully loaded via useGLTF:", scene);
  }, [scene]);

  // Clone scene safely so shared GLTF materials/geometries are not mutated
  const clonedScene = useMemo(() => {
    try {
      const c = scene.clone(true);
      console.log("[PoseViewer Diagnostic] Successfully cloned GLTF scene graph:", c);
      return c;
    } catch (err) {
      console.error("[PoseViewer Diagnostic] GLTF scene clone error:", err);
      return scene;
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      scale={0.15}
      position={[0, 0, 0]}
    />
  );
}

function PoseViewer() {
  useEffect(() => {
    console.log("[PoseViewer Diagnostic] PoseViewer component mounted.");
  }, []);

  return (
    <div className="pose-viewer">

      <div className="viewer-header">

        <div>
          <h3>3D Pose Viewer</h3>
          <span>Target : SAT-001</span>
        </div>

        <div className="viewer-status">
          🟢 LIVE
        </div>

      </div>

      <div className="viewer-body" style={{ position: "relative", width: "100%", flex: 1, minHeight: "340px", background: "#060b14" }}>

        <Suspense fallback={<div style={{ color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#060b14" }}>Loading 3D Model...</div>}>
          <Canvas 
            camera={{ position: [0, 0.5, 3.8], fov: 45 }}
            style={{ width: "100%", height: "100%", background: "#060b14" }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            onCreated={({ gl, scene, camera }) => {
              console.log("[PoseViewer Diagnostic] R3F Canvas created cleanly:", { gl, scene, camera });
            }}
          >
            <color attach="background" args={["#060b14"]} />
            <ambientLight intensity={1.8} />
            <directionalLight position={[5, 5, 5]} intensity={2.5} />
            <directionalLight position={[-5, -5, -5]} intensity={1.2} />
            <SatelliteModel />
            <OrbitControls enableZoom={true} autoRotate={false} />
          </Canvas>
        </Suspense>

      </div>

    </div>
  );
}

useGLTF.preload("/models/satellite.glb");

export default PoseViewer;


