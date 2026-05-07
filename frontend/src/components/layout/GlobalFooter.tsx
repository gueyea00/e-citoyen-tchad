import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function GlobalFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Logo & Ministry */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
              <span className="font-bold text-lg">{t.platformName}</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{t.ministryName}</p>
          </div>

          {/* Col 2: Contact */}
          <div>
            <h3 className="font-semibold text-base mb-4">{t.footer.contact}</h3>
            <div className="flex flex-col gap-3 text-sm opacity-80">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{t.footer.address}</div>
              <a href={`tel:${t.footer.phone}`} className="flex items-center gap-2 hover:opacity-100 transition"><Phone className="h-4 w-4 shrink-0" />{t.footer.phone}</a>
              <a href={`mailto:${t.footer.email}`} className="flex items-center gap-2 hover:opacity-100 transition"><Mail className="h-4 w-4 shrink-0" />{t.footer.email}</a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="font-semibold text-base mb-4">{t.footer.quickLinks}</h3>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link to="/informations" className="hover:opacity-100 transition">{t.nav.informations}</Link>
              <Link to="/documentation" className="hover:opacity-100 transition">{t.nav.documentation}</Link>
            </div>
          </div>

          {/* Col 4: Social */}
          <div>
            <h3 className="font-semibold text-base mb-4">{t.footer.followUs}</h3>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="opacity-60 hover:opacity-100 transition" aria-label="Social">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-xs opacity-60">
          <p>© {year} {t.ministryShort}. {t.footer.copyright}.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:opacity-100 transition">{t.footer.legalNotice}</a>
            <a href="#" className="hover:opacity-100 transition">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
