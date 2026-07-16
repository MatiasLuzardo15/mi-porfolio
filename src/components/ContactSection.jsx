import { ArrowUpRight, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CONTACT_EMAIL = "matiasluzadevv@gmail.com";

const createGmailUrl = ({ subject = "Contacto desde tu portfolio", body = "" } = {}) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: CONTACT_EMAIL,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
};

const DIRECT_GMAIL_URL = createGmailUrl();

export const ContactSection = () => {
  const { toast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    const gmailUrl = createGmailUrl({
      subject: `Contacto desde el portfolio — ${name}`,
      body: `Hola Matías,\n\n${message}\n\nNombre: ${name}\nEmail de contacto: ${email}`,
    });

    const gmailWindow = window.open(gmailUrl, "_blank");
    if (gmailWindow) gmailWindow.opener = null;

    toast({
      title: "Redacción preparada",
      description: "Abrimos Gmail con tu mensaje listo para revisar y enviar.",
    });
  };

  return (
    <section id="contact" className="section-block contact-editorial">
      <div className="section-kicker">
        <span>05 / CONTACTO</span>
        <span>FLORIDA · URUGUAY</span>
      </div>

      <div className="contact-heading">
        <p className="eyebrow"><i /> PROYECTOS / COLABORACIONES</p>
        <h2>Creemos algo<br /><em>que se sienta real.</em></h2>
        <a href={DIRECT_GMAIL_URL} target="_blank" rel="noreferrer">
          {CONTACT_EMAIL} <ArrowUpRight size={20} />
        </a>
      </div>

      <div className="contact-layout">
        <aside className="contact-aside">
          <p>Estoy abierto a oportunidades junior, proyectos freelance y colaboraciones donde pueda aportar desarrollo y sensibilidad visual.</p>
          <div className="contact-details">
            <article className="contact-detail">
              <span className="contact-detail-index">01</span>
              <small>RESPUESTA</small>
              <strong>Dentro de<br />24–48 horas</strong>
              <p>Tiempo estimado</p>
            </article>
            <article className="contact-detail">
              <span className="contact-detail-index">02</span>
              <small>UBICACIÓN</small>
              <strong>Florida,<br />Uruguay</strong>
              <p>GMT−3</p>
            </article>
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>01 / TU NOMBRE</span>
            <input name="name" type="text" placeholder="¿Cómo te llamás?" autoComplete="name" required />
          </label>
          <label>
            <span>02 / TU EMAIL</span>
            <input name="email" type="email" placeholder="nombre@empresa.com" autoComplete="email" required />
          </label>
          <label>
            <span>03 / CONTAME TU IDEA</span>
            <textarea name="message" rows="4" placeholder="Proyecto, oportunidad o simplemente un hola..." required />
          </label>
          <button type="submit">
            REDACTAR EN GMAIL <Send size={17} />
          </button>
          <p className="contact-status" aria-live="polite">
            Al continuar se abrirá Gmail con el mensaje completo. Solo tendrás que revisarlo y enviarlo.
          </p>
        </form>
      </div>
    </section>
  );
};
