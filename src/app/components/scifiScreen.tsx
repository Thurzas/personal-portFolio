import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Style from "./css/main.module.css";

interface ScifiScreenProps {
  title: string;
  children?: React.ReactNode;
  delay?: number; // délai en ms
}

const ScifiScreen = ({ title, children, delay = 0 }: ScifiScreenProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const openScreen = () => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.6, ease: "expo.out" }
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      openScreen();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

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
