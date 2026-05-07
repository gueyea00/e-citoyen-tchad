import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export function GlobalHeader() {
  const { t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-card/95 backdrop-blur-md shadow-sm border-b border-border";

  const textColor = isHome && !scrolled ? "text-primary-foreground" : "text-foreground";

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/informations", label: t.nav.informations },
    { to: "/documentation", label: t.nav.documentation },
    { to: "/suivi-documents", label: t.nav.suiviDocuments }
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
          <span className={`font-bold text-base sm:text-lg ${textColor} transition-colors truncate max-w-[120px] xs:max-w-none`}>
            {t.platformName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-secondary ${location.pathname === link.to
                ? isHome && !scrolled ? "text-secondary" : "text-primary font-semibold"
                : textColor
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-foreground font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSelector />
          </div>
        </div>
      )}
    </header>
  );
}
