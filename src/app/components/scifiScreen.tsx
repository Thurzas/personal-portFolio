import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Style from "./css/main.module.css";

gsap.registerPlugin(ScrollTrigger);

type BadgeVariant = "badgeGreen" | "badgeCyan" | "badgeAmber" | "badgePurple";

interface ScifiScreenProps {
  title: string;
  icon: string;
  accent?: string;           // CSS var, e.g. "var(--green)"
  badge?: { label: string; variant: BadgeVariant };
  children?: React.ReactNode;
  triggerIn: string;
  triggerOut?: string;
}

const ScifiScreen = ({
  title,
  icon,
  accent = "var(--green)",
  badge,
  children,
  triggerIn,
}: ScifiScreenProps) => {
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
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, [triggerIn]);

  return (
    <div className={Style.subScreen} ref={containerRef}>
      <div
        className={Style.screenFrame}
        style={{ "--accent-color": accent } as React.CSSProperties}
      >
        <div className={Style.screenSurface}>
          <div className={Style.sectionHeader}>
            <div className={Style.sectionIcon}>{icon}</div>
            <h2 className={Style.sectionTitle}>{title}</h2>
            {badge && (
              <span className={`${Style.sectionBadge} ${Style[badge.variant]}`}>
                {badge.label}
              </span>
            )}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ScifiScreen;
