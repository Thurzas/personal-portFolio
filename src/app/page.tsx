"use client";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import Style from "./components/css/main.module.css";
import { CinematicCamera } from "./components/cinematicCamera";
import ScifiScreen from "./components/scifiScreen";
import useScreenType from "./components/useScrenType";
import ContactForm from "./components/contactForm";

export default function Home() {
  const cameraRef = useRef<HTMLCanvasElement>(null);
  const screenType = useScreenType();

  let cameraPosition: [number, number, number] = [0, 3, 15];
  let fov = 42;

  if (screenType === "tablet") {
    cameraPosition = [0, 2.5, -8];
    fov = 50;
  } else if (screenType === "mobile") {
    cameraPosition = [0, 2, 10];
    fov = 55;
  }

  return (
    <>
      <div className={Style.header} style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          className={Style.header}
          ref={cameraRef}
          shadows
          camera={{ position: cameraPosition, fov }}
          onCreated={({ gl }) => {
            gl.setClearColor("#350223ff");
          }}
        >
          <CinematicCamera viewType={screenType} />
        </Canvas>
      </div>

      <div className={Style.subWrapper}>

        {/* ── Stats bar ── */}
        <div className={Style.statsBar}>
          <div className={Style.stat}>
            <span className={Style.statN}>5</span>
            <span className={Style.statL}>projets</span>
          </div>
          <div className={Style.stat}>
            <span className={Style.statN}>10+</span>
            <span className={Style.statL}>technologies</span>
          </div>
          <div className={Style.stat}>
            <span className={Style.statN}>2025</span>
            <span className={Style.statL}>sur le marché</span>
          </div>
          <div className={Style.stat}>
            <span className={Style.statN}>Dispo</span>
            <span className={Style.statL}>statut actuel</span>
          </div>
        </div>

        <section id="section-1">
          <ScifiScreen
            title="À propos de moi"
            icon="▶"
            accent="var(--green)"
            badge={{ label: "Profil", variant: "badgeGreen" }}
            triggerIn="#section-1"
            triggerOut="#section-3"
          >
            <p>
              Je m'appelle Matt, développeur passionné par les technologies et la créativité.
            </p>
            <p>
              À côté du code, je m'intéresse aux jeux de rôle sur papier (Donjons &amp; Dragons, Cyberpunk),
              à l'impression 3D et à l'intelligence artificielle générative.
            </p>
            <p>
              J'approfondis mes compétences en Python afin de mieux comprendre des frameworks
              tels que TensorFlow et Xformers.
            </p>
            <p>
              Je sors d'une formation commencée en novembre 2024 et suis sur le marché de l'emploi
              depuis juin 2025.
            </p>
            <div className={Style.skillTags}>
              {["React", "Node.js", "TypeScript", "Python", "Three.js", "WebGL", "PHP", "SQL", "TensorFlow", "3D Print"].map((s) => (
                <span key={s} className={Style.skillTag}>{s}</span>
              ))}
            </div>
          </ScifiScreen>
        </section>

        <div className={Style.scanline} />

        <section id="section-2">
          <ScifiScreen
            title="Mes réseaux"
            icon="◈"
            accent="var(--cyan)"
            badge={{ label: "Liens", variant: "badgeCyan" }}
            triggerIn="#section-2"
            triggerOut="#section-3"
          >
            <div className={Style.socialList}>
              <a className={Style.socialRow} href="https://github.com/Thurzas" target="_blank" rel="noreferrer">
                <span className={Style.socialPlatform}>GitHub</span>
                <span className={Style.socialArrow}>→</span>
                <span className={Style.socialHandle}>
                  <img className={Style.icon} alt="" src="img/github-icon.svg" /> Thurzas
                </span>
                <span className={Style.socialExt}>github.com/Thurzas</span>
              </a>
              <a className={Style.socialRow} href="https://www.linkedin.com/in/mathieu-miot-15a065177/" target="_blank" rel="noreferrer">
                <span className={Style.socialPlatform}>LinkedIn</span>
                <span className={Style.socialArrow}>→</span>
                <span className={Style.socialHandle}>
                  <img className={Style.icon} alt="" src="img/linkedin.svg" /> Mathieu Miot
                </span>
                <span className={Style.socialExt}>linkedin.com/in/…</span>
              </a>
            </div>
          </ScifiScreen>
        </section>

        <div className={Style.scanline} />

        <section id="section-3">
          <ScifiScreen
            title="Mon travail"
            icon="⌗"
            accent="var(--amber)"
            badge={{ label: "Projets", variant: "badgeAmber" }}
            triggerIn="#section-3"
            triggerOut="#section-2"
          >
            <div className={Style.articles}>
              <article>
                <span className={Style.cardType}>Fullstack</span>
                <h4>Le Cookie du patron</h4>
                <p>
                  Boutique en ligne d'une &quot;dark kitchen&quot; faite en équipe durant ma formation.
                  Front React, back API Node.
                </p>
                <img className={Style.photo} alt="Le cookie du patron" src="img/CookiPatron.png" />
                <div className={Style.articleLinks}>
                  <a href="https://github.com/WildCodeSchool/nov24-RemFR-Vert-FullStackAlchemist-G2-P3" target="_blank" rel="noreferrer">
                    <img className={Style.icon} alt="" src="img/github-icon.svg" /> GitHub
                  </a>
                </div>
              </article>

              <article>
                <span className={Style.cardType}>PHP · Équipe</span>
                <h4>La gazette du sorcier</h4>
                <p>Forum écrit en PHP en équipe.</p>
                <img className={Style.photo} alt="La gazette du sorcier" src="img/forumGazetteDuSorcier.png" />
                <div className={Style.articleLinks}>
                  <a href="https://github.com/WildCodeSchool-2024-02/PHP-REM-POEC-05-Gazette-Sorciers" target="_blank" rel="noreferrer">
                    <img className={Style.icon} alt="" src="img/github-icon.svg" /> GitHub
                  </a>
                </div>
              </article>

              <article>
                <span className={Style.cardType}>Prototype · Canvas 2D</span>
                <h4>Blackhole</h4>
                <p>Test de collision inspiré du problème à n corps, avec quadtree.</p>
                <img className={Style.photo} alt="Blackhole collision test" src="img/blackhole.png" />
                <div className={Style.articleLinks}>
                  <a href="https://codepen.io/Thurzas/pen/dyJzOLe" target="_blank" rel="noreferrer">
                    ↗ CodePen
                  </a>
                </div>
              </article>

              <article>
                <span className={Style.cardType}>Prototype · Processing</span>
                <h4>Dungeon procédural</h4>
                <p>Génération procédurale de donjons.</p>
                <img className={Style.photo} alt="Procedural dungeon" src="img/procedural.png" />
                <div className={Style.articleLinks}>
                  <a href="https://github.com/Thurzas/ProceduralDungeon" target="_blank" rel="noreferrer">
                    <img className={Style.icon} alt="" src="img/github-icon.svg" /> GitHub
                  </a>
                </div>
              </article>

              <article>
                <span className={Style.cardType}>Prototype · Processing</span>
                <h4>Ant Colony Simulation</h4>
                <p>Simulation de colonie de fourmis avec phéromones.</p>
                <img className={Style.photo} alt="Ant colony simulation" src="img/ants.jpg" />
                <div className={Style.articleLinks}>
                  <a href="https://github.com/Thurzas/ants" target="_blank" rel="noreferrer">
                    <img className={Style.icon} alt="" src="img/github-icon.svg" /> GitHub
                  </a>
                </div>
              </article>
            </div>
          </ScifiScreen>
        </section>

        <div className={Style.scanline} />

        <section id="section-4">
          <ScifiScreen
            title="Me contacter"
            icon="✉"
            accent="var(--purple)"
            badge={{ label: "Contact", variant: "badgePurple" }}
            triggerIn="#section-4"
            triggerOut="#section-3"
          >
            <ContactForm />
          </ScifiScreen>
        </section>

        {/* ── Footer ── */}
        <footer className={Style.footer}>
          <span className={Style.footerLogo}>Mathieu Miot</span>
          <span>React · Next.js · Three.js · WebGL</span>
          <span>2026</span>
        </footer>

      </div>
    </>
  );
}
