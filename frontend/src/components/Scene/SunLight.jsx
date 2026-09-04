function SunLight() {
  return (
    <>
      <ambientLight intensity={1} />

      <directionalLight
        position={[10, 10, 10]}
        intensity={2}
      />
    </>
  );
}

export default SunLight;