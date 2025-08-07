import {
  Mail,
  MapPin,
  Phone,
  Send,
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
    <section id="contact" className="pt-20 pb-12 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center flex items-center justify-center gap-3">
          <MessageSquare className="text-primary" size={42} />
          Ponte en <span className="text-primary"> Contacto</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          ¿Tienes una idea en mente o te interesa colaborar? No dudes en escribirme.
          Siempre estoy dispuesto a conversar sobre nuevas oportunidades y proyectos.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-semibold mb-6 text-center lg:text-left">
              Información de Contacto
            </h3>

            <div className="space-y-3 lg:space-y-4">
              <div className="flex flex-col lg:flex-row items-center lg:items-center space-y-2 lg:space-y-0 lg:space-x-3 justify-center lg:justify-start">
                <div className="p-3 lg:p-3 rounded-full bg-primary/10 flex-shrink-0">
                  <Mail className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="text-center lg:text-left min-w-0 flex-1">
                  <h4 className="font-medium text-sm lg:text-base">Correo</h4>
                  <a
                    href="mailto:luzardomatias440@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors text-xs lg:text-sm break-all lg:break-normal"
                  >
                    luzardomatias440@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-center space-y-2 lg:space-y-0 lg:space-x-3 justify-center lg:justify-start">
                <div className="p-3 lg:p-3 rounded-full bg-primary/10 flex-shrink-0">
                  <Phone className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="text-center lg:text-left min-w-0 flex-1">
                  <h4 className="font-medium text-sm lg:text-base">Teléfono</h4>
                  <a
                    href="https://wa.me/598091692885"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors text-xs lg:text-sm"
                  >
                    +598 091 692 885
                  </a>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-center space-y-2 lg:space-y-0 lg:space-x-3 justify-center lg:justify-start">
                <div className="p-3 lg:p-3 rounded-full bg-primary/10 flex-shrink-0">
                  <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="text-center lg:text-left min-w-0 flex-1">
                  <h4 className="font-medium text-sm lg:text-base">Ubicación</h4>
                  <span className="text-muted-foreground text-xs lg:text-sm">
                    Florida, Uruguay
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 bg-card p-6 lg:p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6 text-center lg:text-left">Envía un Mensaje</h3>

            <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
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
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm lg:text-base"
                  placeholder="Escribe tu nombre..."
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
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm lg:text-base"
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
                  rows="4"
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm lg:text-base"
                  placeholder="Hola, me gustaría hablar sobre..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2 py-3 lg:py-2"
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
