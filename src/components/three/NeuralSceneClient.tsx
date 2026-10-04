"use client";

import dynamic from "next/dynamic";

const NeuralScene3D = dynamic(() => import("@/components/three/NeuralScene3D"), {
  ssr: false,
});

export default function NeuralSceneClient() {
  return <NeuralScene3D />;
}
