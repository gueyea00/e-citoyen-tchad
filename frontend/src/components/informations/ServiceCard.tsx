import { Link } from "react-router-dom";
import { Building, FileText, Map, Landmark, Trash2, Home } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Service } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  building: Building,
  "file-text": FileText,
  map: Map,
  landmark: Landmark,
  "trash-2": Trash2,
  home: Home,
};

export function ServiceCard({ service }: { service: Service }) {
  const { locale, t } = useLanguage();
  const Icon = iconMap[service.icon] || FileText;

  return (
    <div className="group bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col h-[280px]">
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-secondary-foreground" />
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
          {service.title[locale]}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {service.description[locale]}
        </p>
        <span className="inline-block text-xs font-medium text-accent-foreground bg-accent rounded-full px-3 py-1 mt-3 w-fit">
          {service.direction.name[locale]}
        </span>
      </div>
      <div className="px-6 pb-5">
        <Button asChild variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
          <Link to={`/informations/${service.slug}`}>{t.informations.learnMore}</Link>
        </Button>
      </div>
    </div>
  );
}
