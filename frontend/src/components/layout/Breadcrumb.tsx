import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground py-4" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-foreground transition">{t.breadcrumb.home}</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.to ? (
            <Link to={item.to} className="hover:text-foreground transition">{item.label}</Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
