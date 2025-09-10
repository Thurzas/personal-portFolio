import { useState, useEffect } from "react";

export default function useScreenType() {
  const [screenType, setScreenType] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      if (width <= 600) setScreenType("mobile");
      else if (width <= 1024) setScreenType("tablet");
      else setScreenType("desktop");
    };

    checkScreen(); // check initial

    window.addEventListener("resize", checkScreen); // update on resize
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return screenType;
}
