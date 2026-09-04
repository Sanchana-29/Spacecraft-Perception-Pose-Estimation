import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef } from "react";

import dayTexture from "../../assets/textures/earth_day.jpg";

function Earth() {

    const earthRef = useRef();

    const dayMap = useLoader(TextureLoader, dayTexture);

    useFrame(() => {
        earthRef.current.rotation.y += 0.001;
    });

    return (
        <mesh ref={earthRef}>
           <sphereGeometry args={[1.2, 128, 128]} />
            <meshStandardMaterial map={dayMap} />
        </mesh>
    );
}

export default Earth;