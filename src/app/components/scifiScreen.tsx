import { useRef } from "react";
import { gsap } from "gsap";
import Style from "./css/main.module.css";

interface ScifiScreenProps {
  title: string;
  children?: React.ReactNode;
}

const ScifiScreen = ({ title, children }: ScifiScreenProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const openScreen = () => {
    const el = containerRef.current;
    if (!el) return;
    gsap.set(el, { display: "block" });

    gsap.fromTo(
      el,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.6, ease: "expo.out" }
    );
  };

  const closeScreen = () => {
    const el = containerRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { scaleX: 1, opacity: 1 },
      {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "25% 50%", // centre horizontal
        duration: 0.6,
        ease: "expo.out",
        OnComplete: () => gsap.set(el, { display: "none" }),
      }
    );
  };

  return (
    <div className={Style.subWrapper}>
      <button className={Style.triggerBtn} onClick={openScreen}>
        Ouvrir {title}
      </button>

      <div className={Style.subScreen} ref={containerRef}>
        <div className={Style.screenFrame}>
          <h2>{title}</h2>
          <div className={Style.content}>{children}</div>

          <button className={Style.closeBtn} onClick={closeScreen}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScifiScreen;
