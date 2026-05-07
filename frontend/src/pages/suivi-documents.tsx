import React, { useState } from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { Search, Loader2, CheckCircle2, Clock, FileText, AlertCircle, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Interfaces pour typage des données de l'API externe
interface TrackingStep {
    id: number;
    title: string;
    date: string;
    status: 'completed' | 'current' | 'pending';
    description?: string;
}

interface TrackingData {
    reference: string;
    serviceName: string;
    status: 'En cours' | 'Terminé' | 'Rejeté';
    applicantName: string;
    submissionDate: string;
    steps: TrackingStep[];
}

const SuiviDocuments = () => {
    const [reference, setReference] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!reference.trim()) {
            setError("Veuillez entrer un numéro de suivi valide.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setTrackingData(null);

        try {
            // Appel à l'API externe réelle
            const response = await fetch(`https://e-service-api-ekv9.onrender.com/api/tracking/${reference}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Aucun dossier trouvé pour cette référence.");
                }
                throw new Error("Une erreur est survenue lors de la récupération des données.");
            }
            
            const data = await response.json();
            
            // On s'assure que les données reçues correspondent à notre interface TrackingData
            // Si l'API retourne une structure différente, on peut la mapper ici
            setTrackingData({
                reference: data.reference || reference.toUpperCase(),
                serviceName: data.serviceName || "Service Administratif",
                status: data.status || "En cours",
                applicantName: data.applicantName || "Non spécifié",
                submissionDate: data.submissionDate || "Inconnue",
                steps: data.steps || []
            });
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de la communication avec le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <GlobalHeader />
            <main className="flex-1">
                {/* Header Section */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center gap-6">
                        <h1 className="text-3xl md:text-5xl font-bold text-primary text-center">Suivi des Demandes</h1>
                        <p className="text-lg md:text-xl text-slate-600 text-center max-w-2xl">
                            Suivez l'état d'avancement de vos démarches administratives en temps réel en saisissant votre référence de dossier.
                        </p>
                        
                        <form onSubmit={handleSearch} className="w-full max-w-2xl mt-8 relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors duration-300" />
                            </div>
                            <Input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Entrez votre numéro de suivi (ex: TR-2024-XXXX)..."
                                className="w-full pl-14 pr-40 h-16 text-lg rounded-2xl border-2 border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 placeholder:text-slate-400"
                            />
                            <Button 
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-2 top-2 bottom-2 h-auto px-8 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Recherche...</>
                                ) : (
                                    "Rechercher"
                                )}
                            </Button>
                        </form>

                        {error && (
                            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-3 rounded-lg mt-2 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className="container mx-auto px-4 py-12">
                    {trackingData && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Summary Card */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">{trackingData.serviceName}</h2>
                                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                                            <FileText className="h-4 w-4" /> Réf: <span className="font-semibold text-slate-700">{trackingData.reference}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                                        <Clock className="h-4 w-4" />
                                        {trackingData.status}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Demandeur</p>
                                        <p className="font-medium text-slate-800">{trackingData.applicantName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Date de dépôt</p>
                                        <p className="font-medium text-slate-800 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            {trackingData.submissionDate}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-8">Étapes du dossier</h3>
                                
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {trackingData.steps.map((step, index) => (
                                        <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                                                step.status === 'completed' ? 'bg-green-500 text-white' : 
                                                step.status === 'current' ? 'bg-primary text-white ring-4 ring-primary/20' : 
                                                'bg-slate-200 text-slate-400'
                                            }`}>
                                                {step.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : 
                                                 step.status === 'current' ? <Loader2 className="h-5 w-5 animate-spin" /> : 
                                                 <span className="text-sm font-bold">{index + 1}</span>}
                                            </div>
                                            
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                                    <h4 className={`font-bold text-lg ${step.status === 'pending' ? 'text-slate-500' : 'text-slate-800'}`}>
                                                        {step.title}
                                                    </h4>
                                                    <span className="text-sm font-medium text-slate-500">{step.date}</span>
                                                </div>
                                                {step.description && (
                                                    <p className="text-slate-600 text-sm mt-2">{step.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </main>
            <GlobalFooter />
        </div>
    );
};

export default SuiviDocuments;