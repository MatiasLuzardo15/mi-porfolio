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
import emailjs from '@emailjs/browser';

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Configuración de EmailJS incompleta. Revisa las variables de entorno.');
      }

      const formData = new FormData(e.target);
      const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        message: formData.get('message'),
        to_email: import.meta.env.VITE_CONTACT_EMAIL || 'luzardomatias440@gmail.com',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por tu mensaje. Te responderé pronto.",
      });
      
      e.target.reset();
      
    } catch (error) {
      console.error('Error al enviar email:', error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="py-20 px-4 relative">
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
                    href="https://wa.me/598091692885"
                    target="_blank"
                    rel="noopener noreferrer"
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

          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6">Envía un Mensaje</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
