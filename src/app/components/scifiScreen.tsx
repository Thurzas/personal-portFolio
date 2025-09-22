import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Style from "./css/main.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ScifiScreenProps {
  title: string;
  children?: React.ReactNode;
  triggerIn: string;   // sélecteur ou ID pour déclencher l’apparition
  triggerOut?: string; // sélecteur ou ID pour déclencher la disparition
}

const ScifiScreen = ({ title, children, triggerIn, triggerOut }: ScifiScreenProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  gsap.fromTo(
    el,
    { scaleX: 0, opacity: 0 },
    {
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      ease: "expo.out",
      scrollTrigger: {
        trigger: triggerIn,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse", // <-- clé ici
      },
    }
  );
}, [triggerIn]);

  return (
    <div className={Style.subScreen} ref={containerRef}>
      <div className={Style.screenFrame}>
        <h2>{title}</h2>
        <div className={Style.content}>{children}</div>
      </div>
    </div>
  );
};

export default ScifiScreen;
