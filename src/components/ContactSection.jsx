import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitch,
  Twitter,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setIsSubmitting(false);
    }, 1500);
  };
  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center flex items-center justify-center gap-3">
          <MessageSquare className="text-primary" size={36} />
          Ponte en <span className="text-primary"> Contacto</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          ¿Tienes una idea en mente o te interesa colaborar? No dudes en escribirme.
          Siempre estoy dispuesto a conversar sobre nuevas oportunidades y proyectos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6 text-center md:text-left">
              {" "}
              Información de Contacto
            </h3>

            <div className="space-y-6 flex flex-col items-center md:items-start">
              <div className="flex items-start space-x-4 w-full max-w-sm">
                <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />{" "}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="font-medium">Correo</h4>
                  <a
                    href="mailto:luzardomatias440@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors block"
                  >
                    luzardomatias440@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4 w-full max-w-sm">
                <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />{" "}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="font-medium">Teléfono</h4>
                  <a
                    href="tel:+598091692885"
                    className="text-muted-foreground hover:text-primary transition-colors block"
                  >
                    +598 091 692 885
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4 w-full max-w-sm">
                <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />{" "}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="font-medium">Ubicación</h4>
                  <a className="text-muted-foreground hover:text-primary transition-colors block">
                    Florida, Uruguay
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col items-center md:items-start">
              <h4 className="font-medium mb-4 text-center md:text-left">Conéctate Conmigo</h4>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="https://www.linkedin.com/in/matias-luzardo-a87280248/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-300">
                  <Linkedin className="h-6 w-6 text-primary" />
                </a>
                <a href="https://www.instagram.com/matias_luzardoo/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-300">
                  <Instagram className="h-6 w-6 text-primary" />
                </a>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-8 rounded-lg shadow-xs"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-semibold mb-6">Envía un Mensaje</h3>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Tu Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                  placeholder="Matías Luzardo..."
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Tu Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                  placeholder="ejemplo@gmail.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Tu Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary resize-none"
                  placeholder="Hola, me gustaría hablar sobre..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2"
                )}
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
