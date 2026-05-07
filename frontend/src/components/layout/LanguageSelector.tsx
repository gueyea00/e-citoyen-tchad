import { useLanguage } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/translations";

const langs: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold transition-all ${
            locale === l.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
