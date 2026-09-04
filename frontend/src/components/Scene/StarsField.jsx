import { Stars } from "@react-three/drei";

function StarsField() {
  return (
    <Stars
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      fade
    />
  );
}

export default StarsField;