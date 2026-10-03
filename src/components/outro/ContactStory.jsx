// Contacto closes the story. After the museum goes dark, the light comes back like a morning and
// what is left is a letter addressed to Matías: the form itself. Writing it is the main action;
// sending folds it into a paper plane while Gmail opens with the message ready.
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Github, Linkedin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { easeInOut, easeOut, lerp } from "../projects/fx";
import { clamp, ramp } from "../projects/timeline";
import { glideTo } from "../projects/glide";
import { mixColor, useDocked, useStoryValue, useViewportSize } from "./storyKit";
import { publishScene } from "../chrome/sceneStore";
import "./contact.css";

const CONTACT_EMAIL = "matiasluzadevv@gmail.com";
const createGmailUrl = ({ subject = "Contacto desde tu portfolio", body = "" } = {}) => {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: CONTACT_EMAIL, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
};
const DIRECT_GMAIL_URL = createGmailUrl();
const UNITS = 1.7;
const DAWN = [[0, "#080808"], [0.14, "#1a1714"], [0.42, "#ebe5d9"]];
const DAWN_INK = [[0, "#ededed"], [0.28, "#ededed"], [0.42, "#1d1a16"]];

const appear = (t, y = 14) => ({
  opacity: t,
  transform: `translateY(${(1 - t) * y}px)`,
  visibility: t <= 0.001 ? "hidden" : undefined,
});

// Pinned on large screens; on small ones the scene plays as the section scrolls into view.
function useContactProgress(ref, pinned) {
  const pinnedValue = useStoryValue(ref, UNITS);
  const [entered, setEntered] = useState(0);
  useEffect(() => {
    if (pinned) return undefined;
    const onScroll = () => {
      const node = ref.current;
      if (node) setEntered(clamp(1 - node.getBoundingClientRect().top / (window.innerHeight * 0.85)) * 1.2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinned, ref]);
  return pinned ? pinnedValue : entered;
}

export const ContactStory = () => {
  const { toast } = useToast();
  const storyRef = useRef(null);
  const formRef = useRef(null);
  const size = useViewportSize();
  const pinned = size.w > 900 && size.h >= 640;
  const v = useContactProgress(storyRef, pinned);
  const docked = useDocked(storyRef);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    publishScene("contact", { detail: "Escribime · Florida, Uruguay", mark: "plane" });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const gmailWindow = window.open(createGmailUrl({
      subject: `Contacto desde el portfolio — ${name}`,
      body: `Hola Matías,\n\n${message}\n\nNombre: ${name}\nEmail de contacto: ${email}`,
    }), "_blank");
    if (gmailWindow) gmailWindow.opener = null;
    toast({ title: "Carta lista", description: "Abrimos Gmail con tu mensaje para que lo revises y lo envíes." });
    setSending(true);
  };
  useEffect(() => {
    if (!sending) return undefined;
    const id = setTimeout(() => {
      setSending(false);
      formRef.current?.reset();
    }, 2600);
    return () => clearTimeout(id);
  }, [sending]);

  // The letter rises from below and lays flat; then the stamp and the postmark land.
  const rise = easeOut(ramp(v, 0.22, 0.66));
  const line = (index) => easeOut(ramp(v, 0.46 + index * 0.06, 0.6 + index * 0.06));
  const stamp = ramp(v, 0.66, 0.74);
  const postmark = ramp(v, 0.74, 0.84);
  const ending = easeInOut(ramp(v, 0.06, 0.24));

  return (
    <section
      id="contact"
      className={`contact-story${pinned ? " is-pinned" : ""}`}
      ref={storyRef}
      data-docked={docked ? "" : undefined}
      style={pinned ? { height: `${(UNITS + 1) * 100}vh` } : undefined}
    >
      <div className="contact-viewport" style={{ "--ct-bg": mixColor(DAWN, v), "--ct-ink": mixColor(DAWN_INK, v) }}>
        <header className="ct-ending" style={appear(ending, 18)}>
          <p>Fin del recorrido</p>
          <h2>Ahora te toca a vos.</h2>
        </header>

        <form
          ref={formRef}
          className={`ct-letter${sending ? " is-sending" : ""}`}
          onSubmit={handleSubmit}
          // Once it lies flat the letter has no transform at all, so its text renders crisp
          // instead of as a resampled, slightly rotated layer.
          style={rise >= 0.999 ? undefined : {
            opacity: rise,
            transform: `perspective(1400px) translateY(${(1 - rise) * 45}vh) rotateX(${(1 - rise) * 38}deg) rotate(${lerp(-3, 0, rise)}deg)`,
            willChange: "transform, opacity",
          }}
        >
          <div className="ct-letter-head" style={appear(line(0))}>
            <p><span>Para</span> Matías Luzardo</p>
            <span className="ct-stamp" style={{ opacity: stamp, transform: `rotate(${lerp(-14, 4, stamp)}deg) scale(${lerp(1.5, 1, easeOut(stamp))})` }} aria-hidden="true">
              <span className="ct-stamp-art"><img src="/images/avatar.png?v=2" alt="" /></span>
              <small>UY · 2026</small>
            </span>
            <svg className="ct-postmark" viewBox="0 0 160 120" style={{ opacity: postmark * 0.85, transform: `scale(${lerp(1.3, 1, postmark)})` }} aria-hidden="true">
              <circle cx="60" cy="60" r="44" />
              <circle cx="60" cy="60" r="36" />
              <path id="ct-postmark-arc" d="M 26 60 A 34 34 0 0 1 94 60" fill="none" stroke="none" />
              <text><textPath href="#ct-postmark-arc" startOffset="50%" textAnchor="middle">FLORIDA · UY</textPath></text>
              <text x="60" y="74" textAnchor="middle" className="is-small">GMT−3</text>
              <path d="M108 46 h46 M108 56 h50 M108 66 h46 M108 76 h50" className="is-waves" />
            </svg>
          </div>

          <div className="ct-letter-from" style={appear(line(1))}>
            <label>
              <span>De</span>
              <input name="name" type="text" placeholder="Tu nombre" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" placeholder="nombre@empresa.com" autoComplete="email" required />
            </label>
          </div>

          <label className="ct-letter-body" style={appear(line(2))}>
            <span>Hola Matías,</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Contame tu idea: una oportunidad junior, un proyecto freelance, una colaboración o simplemente un hola…"
              required
            />
          </label>

          <div className="ct-letter-foot" style={appear(line(3))}>
            <button type="submit" disabled={sending}>
              {sending ? "Enviando…" : "Enviar carta"} <Send size={16} />
            </button>
            <p aria-live="polite">{sending ? "Tu carta va en camino a Gmail." : "Se abre Gmail con tu mensaje listo. Respondo en 24–48 h."}</p>
          </div>

        </form>

        {sending && (
          <svg className="ct-plane" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M4 22 44 4 30 44 22 28Z" />
            <path d="M22 28 44 4" />
          </svg>
        )}

        <footer className="ct-footer" style={appear(ramp(v, 0.84, 1), 8)}>
          <a href={DIRECT_GMAIL_URL} target="_blank" rel="noreferrer">{CONTACT_EMAIL}</a>
          <nav aria-label="Redes">
            <a href="https://github.com/MatiasLuzardo15" target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
            <a href="https://www.linkedin.com/in/matias-luzardo-a87280248/" target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>
            <a
              href="#hero"
              onClick={(event) => {
                event.preventDefault();
                glideTo(0, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
              }}
            >
              Volver al inicio <ArrowUp size={13} />
            </a>
          </nav>
          <small>© {new Date().getFullYear()} Matías Luzardo</small>
        </footer>
      </div>
    </section>
  );
};
