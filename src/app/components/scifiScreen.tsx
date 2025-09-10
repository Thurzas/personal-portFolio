import { useRef } from "react";
import { gsap } from "gsap";
import Style from "./css/main.module.css";

interface ScifiScreenProps{
    title: string;
    text: string;
}
const ScifiScreen = ({ title, text }:ScifiScreenProps) => {
  const containerRef = useRef(null);

const openScreen = () => {
  const el = containerRef.current;
  gsap.set(el, { display: "block" });

  gsap.fromTo(
    el,
    {
    
      scaleX: 0,
      opacity: 0,
    },
    {
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      ease: "expo.out",
    }
  );
};

  const closeScreen = () => {
    const el = containerRef.current;
  gsap.fromTo(
    el,
      {
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      ease: "expo.out",
    },
    {
    
      scaleX: 0,
      opacity: 0,
      transformOrigin: "25% 50%", // centre horizontal
    },
  );
  };

  return (
    <div className={Style.subWrapper}>
      <button className={Style.triggerBtn} onClick={openScreen}>
        Ouvrir {title}
      </button>

      <div className={Style.subScreen} ref={containerRef} >
        <div className={Style.screenFrame} >
          <h2>{title}</h2>
          <p>{text}</p>
          <button className={Style.CloseBtn} onClick={closeScreen}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScifiScreen;