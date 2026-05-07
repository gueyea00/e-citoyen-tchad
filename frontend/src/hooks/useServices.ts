import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/i18n/LanguageContext';
import { apiClient } from '@/lib/api-client';

export const useServices = (query: string = '') => {
  const { locale } = useLanguage();

  return useQuery({
    queryKey: ['services', locale, query],
    queryFn: async () => {
      let endpoint = `/services?lang=${locale}`;
      if (query.trim()) endpoint += `&q=${encodeURIComponent(query)}`;

      const data: any[] = await apiClient.fetch(endpoint);
      
      return data.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: {
          fr: item.titre_fr,
          ar: item.titre_ar || item.titre_fr,
          en: item.titre_en || item.titre_fr,
        },
        description: {
          fr: item.desc_fr,
          ar: item.desc_ar || item.desc_fr,
          en: item.desc_en || item.desc_fr,
        },
        direction: {
          name: {
            fr: item.direction?.nom_fr || 'Direction',
            ar: item.direction?.nom_ar || 'Direction',
            en: item.direction?.nom_en || 'Direction',
          }
        }
      }));
    },
  });
};
