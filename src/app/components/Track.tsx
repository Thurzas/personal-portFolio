import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group } from "three";
import Moutain from "./moutain";
import Terrain from "./terrain";

const CHUNK_SIZE = 20; // Taille d'un segment du décor
const CHUNK_COUNT = 4; // Nombre de chunks visibles

export default function Track({ speed = 0.1 }) {
  // Créer une référence pour chaque chunk
  const chunkRefs = useRef<Group[]>([]);

  useFrame(({ camera }) => {
    for (let i = 0; i < CHUNK_COUNT; i++) {
      const chunk = chunkRefs.current[i];
      if (!chunk) continue;

      // Déplacement du chunk
      chunk.position.z += speed;

      // Si le chunk dépasse la caméra, le remettre à la fin du circuit
      if (chunk.position.z > camera.position.z + CHUNK_SIZE) {
        chunk.position.z -= CHUNK_COUNT * CHUNK_SIZE;
      }
    }
  });

  return (
    <>
      {Array.from({ length: CHUNK_COUNT }).map((_, index) => (
        <group
          key={index}
          ref={(el) => (chunkRefs.current[index] = el!)}
          position={[0, 0, -index * CHUNK_SIZE]}
        >
          <Moutain position={new Vector3(15, 0, 0)} />
          <Moutain position={new Vector3(-15, 0, 0)} />
          <Terrain />
        </group>
      ))}
    </>
  );
}
