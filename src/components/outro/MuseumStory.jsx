// Formación as a museum hall. The lights come on, the visitor walks past the exhibition wall and
// the certificates hang as framed works, each with its spotlight and its placard. The scroll is
// the walk: the camera rests in front of every work, then moves on. Any frame opens a close-up.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { useDocked, useStoryGlide, useStoryValue, useViewportSize } from "./storyKit";
import { Odometer } from "../projects/Odometer";
import { publishScene } from "../chrome/sceneStore";
import { easeInOut } from "../projects/fx";
import { clamp, ramp } from "../projects/timeline";
import "./museum.css";

export const CERTIFICATES = [
  { id: 1, title: "Cybersecurity Essentials", institution: "Cisco Networking Academy", image: "/learning/Certificate1.png", year: "2024" },
  { id: 2, title: "Introducción a Jenkins", institution: "The Linux Foundation", image: "/learning/Certificate2.png", year: "2024" },
  { id: 3, title: "Redes, Seguridad y Automatización", institution: "Cisco Networking Academy", image: "/learning/Certificate3.png", year: "2023" },
  { id: 4, title: "Introducción a la Ciberseguridad", institution: "Cisco Networking Academy", image: "/learning/Certificate4.png", year: "2024" },
  { id: 5, title: "Escala tu negocio digital", institution: "Hotmart Academy", image: "/learning/Certificate5.png", year: "2025" },
  { id: 6, title: "English Grammar Mastery", institution: "Udemy", image: "/learning/Certificate6.png", year: "2025" },
  { id: 7, title: "Essential Photoshop Course", institution: "Udemy", image: "/learning/Certificate7.png", year: "2025" },
  { id: 8, title: "Technical Support Fundamentals", institution: "Coursera", image: "/learning/Certificate8.png", year: "2026", certificateLink: "https://www.coursera.org/account/accomplishments/verify/JE121XW3RVV8" },
  { id: 9, title: "Fundamentos de ciberseguridad", institution: "Santander Open Academy", image: "/learning/Certificate9.png", year: "2026" },
  { id: 10, title: "Cybersecurity Specialist", institution: "4Geeks Academy / UTEC", image: "/learning/Certificate10.png", year: "2026" },
  { id: 11, title: "Desarrollo y Crecimiento Profesional", institution: "Santander Open Academy", image: "/learning/Certificate11.png", year: "2026" },
];

const COUNT = CERTIFICATES.length;
// Stops along the wall: the exhibition title, every work, and the closing wall.
const STOPS = [-1.35, ...CERTIFICATES.map((_, index) => index), COUNT - 1 + 1.35];
const STEP = 0.45;
const FIRST = 1.25;
const timeOf = (stop) => (stop === 0 ? 0 : FIRST + (stop - 1) * STEP);
const UNITS = timeOf(STOPS.length - 1) + 0.75;
const restOf = (index) => timeOf(index + 1) + STEP * 0.2;

// Camera position along the wall: it rests at each stop, then walks to the next one.
const cameraAt = (v) => {
  const last = STOPS.length - 1;
  if (v >= timeOf(last)) return STOPS[last];
  let stop = 0;
  while (stop < last && v >= timeOf(stop + 1)) stop += 1;
  const from = timeOf(stop);
  const to = timeOf(stop + 1);
  const rest = stop === 0 ? 0.68 : 0.42;
  const t = easeInOut(clamp(((v - from) / (to - from) - rest) / (1 - rest)));
  return STOPS[stop] + (STOPS[stop + 1] - STOPS[stop]) * t;
};

function CloseUp({ certificate, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);
  return createPortal(
    <div className="mu-closeup" role="dialog" aria-modal="true" aria-label={certificate.title} onClick={onClose}>
      <div className="mu-closeup-card" onClick={(event) => event.stopPropagation()}>
        <button ref={closeRef} type="button" className="mu-closeup-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        <div className="mu-closeup-art"><img src={certificate.image} alt={`Certificado: ${certificate.title}`} /></div>
        <div className="mu-closeup-label">
          <span>N.º {String(certificate.id).padStart(2, "0")} · {certificate.year}</span>
          <h3>{certificate.title}</h3>
          <p>{certificate.institution}</p>
          {certificate.certificateLink && <a href={certificate.certificateLink} target="_blank" rel="noreferrer">Ver credencial <ArrowUpRight size={15} /></a>}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export const MuseumStory = () => {
  const storyRef = useRef(null);
  const v = useStoryValue(storyRef, UNITS);
  const docked = useDocked(storyRef);
  const glide = useStoryGlide(storyRef);
  const size = useViewportSize();
  const [open, setOpen] = useState(null);
  const compact = size.w <= 900;

  const camera = cameraAt(v);
  const current = Math.max(0, Math.min(COUNT - 1, Math.round(camera)));
  // The lights go out only where the closing scene takes over in place; elsewhere the hall stays lit as it scrolls away.
  const handoff = size.w > 900 && size.h >= 640;
  const lights = ramp(v, 0.05, 0.5) * (handoff ? 1 - ramp(v, UNITS - 0.32, UNITS - 0.04) : 1);
  const spacing = compact ? size.w * 0.86 : Math.min(size.w * 0.64, 900);
  const railOn = camera > -0.6 && camera < COUNT - 0.4;
  // The page chrome names the work in front of the visitor.
  const stop = camera < -0.6 ? "intro" : camera > COUNT - 0.4 ? "outro" : String(current);
  useEffect(() => {
    if (stop === "intro") publishScene("aprendizaje", { detail: "Exposición permanente", mark: "avatar" });
    else if (stop === "outro") publishScene("aprendizaje", { detail: "Fin del recorrido", mark: "avatar" });
    else {
      const number = String(Number(stop) + 1).padStart(2, "0");
      publishScene("aprendizaje", { detail: `N.º ${number} · ${CERTIFICATES[Number(stop)].title}`, mark: `frame:${number}` });
    }
  }, [stop]);

  const place = (slot) => {
    const d = slot - camera;
    const tilt = Math.max(-38, Math.min(38, d * -16));
    return {
      d,
      transform: `translate(-50%, -50%) translate3d(${d * spacing}px, 0, ${-Math.abs(d) * 150}px) rotateY(${tilt}deg)`,
      light: lights * Math.max(0.12, 1 - Math.abs(d) * 0.9),
    };
  };
  const intro = place(STOPS[0]);
  const outro = place(STOPS[STOPS.length - 1]);

  return (
    <section id="aprendizaje" className="museum-story" ref={storyRef} data-docked={docked ? "" : undefined} style={{ height: `${(UNITS + 1) * 100}vh` }}>
      <div className={`museum-viewport${compact ? " is-compact" : ""}`} style={{ "--lights": lights }}>
        <div className="mu-wall" aria-hidden="true" />
        <div className="mu-floor" aria-hidden="true" />

        <div className="mu-hall" style={{ opacity: ramp(v, 0.02, 0.4) }}>
          <div className="mu-piece mu-intro" style={{ transform: intro.transform, "--light": intro.light }}>
            <span className="mu-spot" aria-hidden="true" />
            <p className="mu-kicker"><span>04 / APRENDIZAJE</span><i /><span>EXPOSICIÓN PERMANENTE</span></p>
            <h2>Curiosidad aplicada.<br /><em>Conocimiento en progreso.</em></h2>
            <p>Certificaciones que complementan mi formación y amplían mi forma de resolver problemas.</p>
            <small>{COUNT} obras · 2023 — 2026 · Tocá un cuadro para verlo de cerca</small>
          </div>

          {CERTIFICATES.map((certificate, index) => {
            const { d, transform, light } = place(index);
            const label = clamp(1 - Math.abs(d) * 2.6);
            return (
              <div key={certificate.id} className="mu-piece" style={{ transform, "--light": light, zIndex: 20 - Math.round(Math.abs(d) * 2) }}>
                <span className="mu-spot" aria-hidden="true" />
                <button
                  type="button"
                  className="mu-frame"
                  onClick={() => setOpen(certificate)}
                  onFocus={() => { if (Math.abs(index - camera) > 0.5) glide(restOf(index)); }}
                  aria-label={`Ver de cerca: ${certificate.title}, ${certificate.institution}, ${certificate.year}`}
                >
                  <span className="mu-mat"><img src={certificate.image} alt="" loading={index < 3 ? "eager" : "lazy"} /></span>
                </button>
                <div className="mu-placard" style={{ opacity: label * lights, transform: `translateY(${(1 - label) * 10}px)` }} aria-hidden="true">
                  <span>N.º {String(index + 1).padStart(2, "0")} · {certificate.year}</span>
                  <strong>{certificate.title}</strong>
                  <small>{certificate.institution}</small>
                  <em>Certificado · tocá para ver de cerca</em>
                </div>
              </div>
            );
          })}

          <div className="mu-piece mu-outro" style={{ transform: outro.transform, "--light": outro.light }}>
            <span className="mu-spot" aria-hidden="true" />
            <p className="mu-kicker"><span>FIN DEL RECORRIDO</span></p>
            <h3>La sala sigue abierta.<br /><em>Siempre hay algo por aprender.</em></h3>
            <small><ArrowDown size={14} /> Seguí bajando: hablemos</small>
          </div>
        </div>

        <span className="mu-dust" aria-hidden="true" />

        {/* The hall plan: one small frame per work along a line, the current one lit. */}
        <nav className="mu-index" style={{ opacity: railOn ? 1 : 0, pointerEvents: railOn ? "auto" : "none" }} aria-label="Índice de certificados">
          <p className="mu-index-label" aria-hidden="true">
            <span className="mu-index-count"><Odometer text={String(current + 1).padStart(2, "0")} /><small>/ {COUNT}</small></span>
            <span className="mu-index-title">{CERTIFICATES[current].title}</span>
          </p>
          <ol style={{ "--fill": clamp((camera + 0.5) / COUNT) }}>
            {CERTIFICATES.map((certificate, index) => (
              <li key={certificate.id}>
                <button
                  type="button"
                  className={index === current ? "is-current" : index < current ? "is-past" : ""}
                  aria-label={`${index + 1}. ${certificate.title}`}
                  aria-current={index === current ? "step" : undefined}
                  onClick={() => glide(restOf(index))}
                >
                  <i />
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {open && <CloseUp certificate={open} onClose={() => setOpen(null)} />}
    </section>
  );
};
