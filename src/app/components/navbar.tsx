"use client";
import { useEffect, useState } from "react";
import Style from "./css/navbar.module.css";

const SECTIONS = [
  { id: "section-1", label: "Profil" },
  { id: "section-2", label: "Réseaux" },
  { id: "section-3", label: "Projets" },
  { id: "section-4", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav className={Style.nav}>
      <button className={Style.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <span className={Style.logoBracket}>[</span>
        MM
        <span className={Style.logoBracket}>]</span>
      </button>
      <ul className={Style.links}>
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`${Style.link} ${active === id ? Style.active : ""}`}
              onClick={() => scrollTo(id)}
            >
              {active === id && <span className={Style.dot} />}
              {label}
            </button>
          </li>
        ))}
      </ul>
      <a
        className={Style.cvBtn}
        href="/cv-mathieu-miot.pdf"
        download="CV_Mathieu_Miot.pdf"
        target="_blank"
        rel="noreferrer"
      >
        ↓ CV
      </a>
    </nav>
  );
}