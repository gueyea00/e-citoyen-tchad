/**
 * Client API centralisé pour E-Citoyen.
 * Utilise la variable d'environnement VITE_API_URL.
 */

const API_BASE_URL = '/api';


export const apiClient = {
  /**
   * Wrapper pour fetch avec configuration de base
   */
  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur API: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Récupère l'URL de base brute si nécessaire (ex: pour les téléchargements de fichiers)
   */
  getBaseUrl() {
    return API_BASE_URL;
  }
};

export default apiClient;
