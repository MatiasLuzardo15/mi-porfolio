import { ArrowUp, ArrowUpRight, Github, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="editorial-footer">
      <div className="footer-mark" aria-label="ML">
        <span>M</span><span className="footer-mark-outline">L</span>
      </div>
      <p>Ideas claras, código sólido<br />y experiencias humanas.</p>
      <div className="footer-links">
        <a href="https://github.com/MatiasLuzardo15" target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a>
        <a href="https://www.linkedin.com/in/matias-luzardo-a87280248/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} /></a>
        <a href="#hero">Volver arriba <ArrowUp size={14} /></a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MATÍAS LUZARDO</span>
        <span>FLORIDA · URUGUAY</span>
      </div>
    </footer>
  );
};
