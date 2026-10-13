import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef } from "react";

import dayTexture from "../../assets/textures/earth_day.jpg";

function Earth({ isMini = false }) {

    const earthRef = useRef();

    const dayMap = useLoader(TextureLoader, dayTexture);

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001;
        }
    });

    return (
        <mesh ref={earthRef}>
           <sphereGeometry args={[1.2, isMini ? 32 : 128, isMini ? 32 : 128]} />
            <meshStandardMaterial map={dayMap} />
        </mesh>
    );
}

export default Earth;