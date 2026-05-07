import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";

import { ServiceCard } from "@/components/informations/ServiceCard";
import { useServices } from "@/hooks/useServices";
import { Input } from "@/components/ui/input";

const Informations = () => {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");

  const { data: filtered = [], isLoading } = useServices(query);

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t.informations.title}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.informations.subtitle}</p>
          </div>

          <div className="max-w-xl mx-auto mb-10">
            <div className="relative group">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.informations.searchPlaceholder}
                className="ps-10 pe-10 bg-background/50 focus:bg-background transition-colors"
                aria-label={t.informations.searchPlaceholder}
              />
              {query && (
                <button 
                  onClick={() => setQuery("")} 
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <p className="text-center text-muted-foreground py-16">Chargement des services...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">{t.informations.noResults}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
              {filtered.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Informations;
