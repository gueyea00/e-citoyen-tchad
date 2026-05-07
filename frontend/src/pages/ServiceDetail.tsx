import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Clock, ExternalLink, Download, Printer, PlayCircle, FileText, Film, ChevronRight, Landmark } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { Button } from "@/components/ui/button";

import { useServiceDetail } from "@/hooks/useServiceDetail";
import { useDownloadDocument } from "@/hooks/useDocuments";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useLanguage();
  const { mutate: downloadDoc } = useDownloadDocument();

  const { data: service, isLoading } = useServiceDetail(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Récupération des données sécurisées...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <GlobalHeader />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Service non trouvé</h2>
            <p className="text-muted-foreground mb-6">La procédure demandée n'existe pas ou a été déplacée.</p>
            <Button asChild variant="default">
              <Link to="/informations">{t.serviceDetail.back}</Link>
            </Button>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  const dir = service.direction || {
    name: { fr: "Direction Générale", ar: "المديرية العامة", en: "General Direction" },
    address: { fr: "Siège Administratif", ar: "المقر الإداري", en: "Administrative Headquarters" },
    phone: "+235",
    email: "contact@ministere.gov",
    hours: { fr: "08:00 - 15:30", ar: "08:00 - 15:30", en: "08:00 - 15:30" }
  };
  const videoUrl = service.videoUrl ? service.videoUrl[locale] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <GlobalHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb / Back */}
          <nav className="mb-8">
            <Link to="/informations" className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowLeft className="h-4 w-4" />
              </div>
              {t.serviceDetail.back}
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Core Info & Stepper (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Main Header Card */}
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Procédure Officielle
                    </span>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{service.title[locale]}</h1>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                      <Printer className="h-4 w-4" /> {t.serviceDetail.print}
                    </Button>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-secondary/30 ps-6">
                  {service.descriptionLong[locale]}
                </p>
              </div>

              {/* Steps Section */}
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <PlayCircle className="h-6 w-6 text-primary" />
                  {t.serviceDetail.process}
                </h2>

                <div className="relative ps-4 space-y-10">
                  {/* Vertical Line */}
                  <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-muted" />

                  {service.steps.map((step, i) => (
                    <div key={step.id} className="relative flex gap-8 group">
                      {/* Step Number Circle */}
                      <div className="relative z-10 h-10 w-10 rounded-full bg-white border-4 border-primary shadow-sm flex items-center justify-center font-black text-primary text-sm shrink-0 transition-transform group-hover:scale-110">
                        {step.order}
                      </div>

                      <div className="flex-1 bg-muted/20 rounded-xl p-5 border border-border/50 transition-colors group-hover:bg-muted/40 group-hover:border-primary/20">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <h3 className="font-bold text-lg text-foreground">{step.title[locale]}</h3>
                          {step.duration && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-foreground bg-secondary/10 rounded-full px-3 py-1">
                              <Clock className="h-3 w-3" /> {step.duration[locale]}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{step.description[locale]}</p>

                        {step.requiredDocs && (
                          <div className="bg-white/80 rounded-lg p-3 border border-border/50 flex items-start gap-3">
                            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t.serviceDetail.requiredDocs}</p>
                              <p className="text-xs text-foreground font-medium">{step.requiredDocs[locale]}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Direction, Video, Documents (4 cols) - Everything visible at once */}
            <div className="lg:col-span-4 space-y-6">

              {/* 1. Direction Habilitée */}
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 h-20 w-20 bg-secondary/5 rounded-bl-full -mr-10 -mt-10" />
                <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-secondary" />
                  {t.serviceDetail.authorizedDirection}
                </h2>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-bold text-primary text-sm">{dir.name[locale]}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 text-muted-foreground group">
                      <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="pt-1">{dir.address[locale]}</span>
                    </div>
                    <a href={`tel:${dir.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition group">
                      <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      {dir.phone}
                    </a>
                  </div>
                  <Button variant="default" className="w-full shadow-sm bg-primary hover:bg-primary/90" asChild>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(dir.address.fr)}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 me-2" /> {t.serviceDetail.viewMap}
                    </a>
                  </Button>
                </div>
              </div>

              {/* 2. Vidéo Explicative - Available at glance */}
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6">
                <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Film className="h-5 w-5 text-secondary" />
                  {t.serviceDetail.video}
                </h2>
                {videoUrl ? (
                  <div className="aspect-video rounded-xl overflow-hidden shadow-inner bg-black ring-1 ring-border">
                    <iframe
                      src={videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-center p-4">
                    <Film className="h-8 w-8 text-muted/30 mb-2" />
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t.serviceDetail.videoUnavailable}</p>
                  </div>
                )}
              </div>

              {/* 3. Documents Relatifs - Available at glance */}
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6">
                <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  {t.serviceDetail.documents}
                </h2>
                <div className="space-y-3">
                  {service.documents.length > 0 ? (
                    service.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${doc.format === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {doc.format}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-foreground truncate">{doc.title[locale]}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{doc.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-primary hover:bg-primary/10 rounded-full"
                          onClick={() => downloadDoc(doc.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-4">Aucun document requis pour cette phase.</p>
                  )}
                </div>
                {service.documents.length > 0 && (
                  <Link to="/documentation" className="flex items-center justify-center gap-2 text-xs font-bold text-primary mt-4 hover:text-primary/80 transition-colors group">
                    {t.serviceDetail.allDocuments} <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ServiceDetail;
