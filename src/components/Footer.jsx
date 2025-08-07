import { ArrowUp, Heart, Code, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative mt-6 bg-card border-t border-border">
      {/* Borde decorativo sutil */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Móvil: Layout vertical simple */}
        <div className="block md:hidden space-y-6 text-center">
          {/* Logo y título */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <Code className="w-3 h-3 text-primary" />
            </div>
            <span className="font-semibold text-primary">[ML] Portfolio</span>
          </div>
          
          {/* Redes sociales */}
          <div className="flex justify-center gap-4">
            <a 
              href="mailto:luzardomatias440@gmail.com" 
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors duration-200"
            >
              <Mail className="w-4 h-4 text-primary" />
            </a>
            <a 
              href="https://github.com/MatiasLuzardo15" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors duration-200"
            >
              <Github className="w-4 h-4 text-primary" />
            </a>
            <a 
              href="https://www.linkedin.com/in/matias-luzardo-a87280248/" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4 text-primary" />
            </a>
          </div>
          
          {/* Copyright simple */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>&copy; {currentYear} Matías Luzardo</div>
            <div className="flex items-center justify-center gap-1">
              Hecho con <Heart className="w-3 h-3 text-red-500" /> en Uruguay
            </div>
          </div>
        </div>

        {/* Desktop: Layout horizontal */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            
            {/* Lado izquierdo */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">[ML] Portfolio</h3>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>&copy; {currentYear}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Hecho con <Heart className="w-3 h-3 text-red-500" /> en Uruguay
                </span>
              </div>
            </div>

            {/* Lado derecho */}
            <div className="flex items-center gap-4">
              {/* Redes sociales */}
              <div className="flex gap-3">
                <a 
                  href="mailto:luzardomatias440@gmail.com" 
                  className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Mail className="w-4 h-4 text-primary" />
                </a>
                <a 
                  href="https://github.com/MatiasLuzardo15" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Github className="w-4 h-4 text-primary" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/matias-luzardo-a87280248/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Linkedin className="w-4 h-4 text-primary" />
                </a>
              </div>
              
              {/* Botón volver arriba */}
              <a
                href="#hero"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 hover:scale-105 text-sm"
              >
                <span className="hidden lg:inline">Arriba</span>
                <ArrowUp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
