import { useReducedMotion } from "framer-motion";
import { SiteChrome } from "../components/chrome/SiteChrome";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { IntroStory } from "../components/intro/IntroStory";
import { ProjectsSection } from "../components/ProjectsSection";
import { SkillsSection } from "../components/SkillsSection";
import { LearningSection } from "../components/LearningSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { ToolsStory } from "../components/outro/ToolsStory";
import { MuseumStory } from "../components/outro/MuseumStory";
import { ContactStory } from "../components/outro/ContactStory";

export const Home = () => {
  // With reduced motion the page stays the calm, static editorial version.
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return (
      <div className="site-shell">
        <SiteChrome />
        <main>
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <LearningSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    );
  }
  // One continuous experience: every story picks up where the previous one lets go, and the
  // page ends on the contact scene.
  return (
    <div className="site-shell">
      <SiteChrome />
      <main>
        <IntroStory />
        <ProjectsSection joined />
        <ToolsStory />
        <MuseumStory />
        <ContactStory />
      </main>
    </div>
  );
};
