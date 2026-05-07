import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <GlobalHeader />

      {/* Hero Section - Full Screen */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/70 via-navy/60 to-navy-dark/80" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-6 flex justify-center">
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="h-16 w-16 md:h-20 md:w-20 object-contain opacity-90 animate-fade-in" 
            />
          </div>
          <h1
            className="text-2xl xs:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-in"
            style={{ animationDelay: "0.15s" }}
          >
            {t.hero.title}
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto animate-fade-in whitespace-pre-line"
            style={{ animationDelay: "0.3s" }}
          >
            {t.hero.subtitle}
          </p>
          <div className="animate-fade-in" style={{ animationDelay: "0.45s" }}>
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12 font-semibold shadow-float"
            >
              <Link to="/informations">{t.hero.cta}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
