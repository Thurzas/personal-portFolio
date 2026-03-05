import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderGLTF } from "./shaderGLTF";
import { ShaderText3DMatrix } from "./shaderText3D";
import GlyphRain from "./GlyphRain";
import Sunset from "./sunset";
import { Vector3 } from "three";

gsap.registerPlugin(ScrollTrigger);

interface CinematicCameraProps {
  viewType: string;
}

export function CinematicCamera({ viewType }: CinematicCameraProps) {
  const { camera } = useThree();
  const carRef  = useRef<any>(null);
  const nameRef = useRef<any>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  // Avoid setState on every tick — only update when value actually changes
  const titleVisibleRef = useRef(false);
  const setTitle = (v: boolean) => {
    if (v !== titleVisibleRef.current) {
      titleVisibleRef.current = v;
      setTitleVisible(v);
    }
  };

  useEffect(() => {
    const isMobile = viewType === "mobile";

    // Pin the initial camera position so GSAP starts from a known state.
    // This prevents the "sursaut" caused by a stale captured value.
    gsap.set(camera.position, { x: 0, y: 3, z: 15 });

    const ctx = gsap.context(() => {

      /*
       * Single timeline → single ScrollTrigger.
       * No handoff between two competing triggers, no position discontinuity,
       * scrub reversal works cleanly in both directions.
       *
       * Proportions (duration = relative weight within the timeline):
       *   Phase 1 (75%): main dolly-in toward the DeLorean
       *   Phase 2 (25%): subtle drift once the car is framed
       */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: document.body,
          start: "top top",          // fires on first scroll pixel
          endTrigger: "#section-3",
          end: "top 50%",
          scrub: 1.5,
          onUpdate: (self) => {
            // Appears at 35% of the journey, stays visible until end of scroll
            setTitle(self.progress > 0.35);
          },
        },
      });

      tl
        .to(camera.position, {
          x: isMobile ? -5 : -10,
          y: 3,
          z: isMobile ? -11 : -21,
          duration: 3,   // phase 1 — 75% of timeline
        })
        .to(camera.position, {
          x: -10,
          y: 3,
          z: -20,
          duration: 1,   // phase 2 — 25% of timeline
        });

      // Keep camera.lookAt locked onto the DeLorean every frame
      gsap.ticker.add(() => {
        if (carRef.current) {
          camera.lookAt(carRef.current.position);
        }
      });
    });

    return () => ctx.revert();
  }, [camera, viewType]);

  return (
    <>
      <ShaderGLTF
        ref={carRef}
        gltfPath="/delorean.glb"
        texturePath="/textures/matrix_glyph_atlas.png"
        position={[0, 0, -50]}
        scale={[0.25, 0.25, 0.25]}
      />
      {titleVisible && (
        <>
          <ShaderText3DMatrix
            text={"Welcome on my site"}
            texturePath={"/textures/matrix_glyph_atlas.png"}
            position={[0, 10, -48]}
            rotation={[0, 0, 0]}
            fontPath={"/fonts/Orbitron_Regular.json"}
            intensity={5}
          />
          <ShaderText3DMatrix
            ref={nameRef}
            text={"Mathieu Miot"}
            texturePath={"/textures/matrix_glyph_atlas.png"}
            position={[-3, 5, -39]}
            rotation={[0, 0, 0]}
            fontPath={"/fonts/Orbitron_Regular.json"}
            intensity={5}
          />
        </>
      )}
      <GlyphRain
        texturePath={"/textures/matrix_glyph_atlas.png"}
        count={1000}
        speed={30}
      />
      <Sunset position={new Vector3(0, 50, 30)} />
    </>
  );
}
