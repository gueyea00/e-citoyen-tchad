import { useState, useMemo } from "react";
import { Download, Printer, Search, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocuments, useDownloadDocument } from "@/hooks/useDocuments";

const Documentation = () => {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");

  const { data: filtered = [], isLoading } = useDocuments(query);
  const { mutate: downloadDoc } = useDownloadDocument();

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t.documentation.title}</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.documentation.subtitle}</p>
          </div>

          <div className="max-w-xl mx-auto mb-10">
            <div className="relative group">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.documentation.searchPlaceholder}
                className="ps-10 pe-10 bg-background/50 focus:bg-background transition-colors"
                aria-label={t.documentation.searchPlaceholder}
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
            <span className="block text-end text-sm text-muted-foreground mt-2">
              {filtered.length} {t.documentation.documentsFound}
            </span>
          </div>

          {/* Documents Grid */}
          {isLoading ? (
            <p className="text-center text-muted-foreground py-16">Chargement des documents en cours...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
              {filtered.map((doc: any) => {
                return (
                  <div key={doc.id} className="bg-card rounded-xl border border-border shadow-card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${doc.format === "PDF" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      {doc.format}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm leading-snug">{doc.title[locale]}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{doc.size}</span>
                        <span>·</span>
                        <span>{doc.updatedAt}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {doc.languages.map((l) => (
                          <span key={l} className="text-[10px] font-semibold bg-muted text-muted-foreground rounded px-1.5 py-0.5 uppercase">{l}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => downloadDoc(doc.id)} title={t.serviceDetail.download}><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => window.print()} title={t.serviceDetail.print}><Printer className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Documentation;
