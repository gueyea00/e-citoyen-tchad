import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/i18n/LanguageContext';
import { apiClient } from '@/lib/api-client';

export const useServiceDetail = (slug?: string) => {
  const { locale } = useLanguage();

  return useQuery({
    queryKey: ['serviceDetail', slug, locale],
    queryFn: async () => {
      const item = await apiClient.fetch(`/services/${slug}`);

      return {
        id: item.id,
        slug: item.slug,
        title: {
          fr: item.titre_fr,
          ar: item.titre_ar || item.titre_fr,
          en: item.titre_en || item.titre_fr,
        },
        descriptionLong: {
          fr: item.desc_fr,
          ar: item.desc_ar || item.desc_fr,
          en: item.desc_en || item.desc_fr,
        },
        direction: {
          name: {
            fr: item.direction?.nom_fr || 'Direction',
            ar: item.direction?.nom_ar || 'Direction',
            en: item.direction?.nom_en || 'Direction',
          },
          address: {
            fr: item.direction?.adresse || '',
            ar: item.direction?.adresse || '',
            en: item.direction?.adresse || '',
          },
          phone: item.direction?.telephone || '',
          email: item.direction?.email || '',
          hours: {
            fr: item.direction?.horaires || '',
            ar: item.direction?.horaires || '',
            en: item.direction?.horaires || '',
          }
        },
        steps: item.etapes?.map((step: any) => ({
          id: step.id,
          order: step.ordre,
          title: {
            fr: step.titre_fr,
            ar: step.titre_ar || step.titre_fr,
            en: step.titre_en || step.titre_fr,
          },
          description: {
            fr: step.desc_fr,
            ar: step.desc_ar || step.desc_fr,
            en: step.desc_en || step.desc_fr,
          },
          duration: step.duree ? {
              fr: step.duree, ar: step.duree, en: step.duree
          } : undefined,
          requiredDocs: step.docs_requis ? {
              fr: step.docs_requis, ar: step.docs_requis, en: step.docs_requis
          } : undefined
        })) || [],
        videoUrl: (item.videos || []).reduce((acc: any, v: any) => {
          acc[v.langue] = v.url;
          return acc;
        }, {}),
        documents: item.documents?.map((doc: any) => ({
          id: doc.id,
          title: {
             fr: doc.titre_fr,
             ar: doc.titre_ar || doc.titre_fr,
             en: doc.titre_en || doc.titre_fr,
          },
          format: doc.format || "PDF",
          size: doc.taille ? `${Math.round(doc.taille / 1024)} KB` : "1.5 MB"
        })) || []
      };
    },
    enabled: !!slug
  });
};
