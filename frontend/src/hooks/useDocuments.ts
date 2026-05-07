import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/**
 * Hook pour récupérer la liste des documents filtrée par une recherche
 */
export const useDocuments = (query: string = '') => {
  return useQuery({
    queryKey: ['documents', query],
    queryFn: async () => {
      let endpoint = '/documents';
      if (query.trim()) endpoint += `?q=${encodeURIComponent(query)}`;
      
      try {
        const data: any[] = await apiClient.fetch(endpoint);
        
        // Adaptation de la structure Backend -> Frontend
        return data.map(item => ({
          id: item.id,
          title: {
            fr: item.titre_fr,
            ar: item.titre_ar || item.titre_fr,
            en: item.titre_en || item.titre_fr,
          },
          format: item.format || 'PDF',
          size: item.taille ? `${Math.round(item.taille / 1024)} KB` : '—',
          updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '—',
          languages: (item.langues && item.langues.length > 0) ? item.langues : ['fr']
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
        throw error;
      }
    }
  });
};

/**
 * Hook pour déclencher le téléchargement sécurisé via Token
 */
export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      // 1. Demander un lien de téléchargement sécurisé
      const { downloadUrl } = await apiClient.fetch(`/documents/${documentId}/download`);

      // 2. Déclencher le téléchargement
      // downloadUrl est déjà de la forme /api/documents/download-secure?token=XXX
      window.location.href = `${apiClient.getBaseUrl().replace("/api", "")}${downloadUrl}`;
    },
  });
};

/**
 * Hook pour visualiser le document (ouverture dans un nouvel onglet)
 */
export const useViewDocument = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      // 1. Demander un lien de téléchargement sécurisé
      const { downloadUrl } = await apiClient.fetch(`/documents/${documentId}/download`);

      // 2. Ouvrir dans un nouvel onglet avec inline=true
      const baseUrl = apiClient.getBaseUrl().replace("/api", "");
      window.open(`${baseUrl}${downloadUrl}&inline=true`, '_blank');
    },
  });
};
