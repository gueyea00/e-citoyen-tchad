import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// ============================================
// GESTION DES CONTENUS / TEXTES DU SITE (CmsConfig)
// ============================================

/**
 * Récupère tous les contenus CMS (textes du site)
 * Clé = "translations" | "site_config" | etc.
 */
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const configs = await prisma.cmsConfig.findMany({
      orderBy: { cle: 'asc' }
    });
    // Transforme en objet { cle: valeurParsée }
    const result: Record<string, any> = {};
    for (const config of configs) {
      try {
        result[config.cle] = JSON.parse(config.valeur);
      } catch {
        result[config.cle] = config.valeur;
      }
    }
    res.json(result);
  } catch (error: any) {
    console.error("Erreur getAllContent:", error);
    res.status(500).json({ error: 'Erreur de récupération des contenus', details: error?.message || String(error) });
  }
};

/**
 * Récupère un contenu CMS par sa clé (public - pour le frontend)
 */
export const getContentByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const config = await prisma.cmsConfig.findUnique({ where: { cle: key } });
    if (!config) return res.status(404).json({ error: 'Contenu non trouvé' });
    try {
      res.json({ key: config.cle, value: JSON.parse(config.valeur), updatedAt: config.derniere_modif });
    } catch {
      res.json({ key: config.cle, value: config.valeur, updatedAt: config.derniere_modif });
    }
  } catch (error: any) {
    console.error("Erreur getContentByKey:", error);
    res.status(500).json({ error: 'Erreur de récupération', details: error?.message || String(error) });
  }
};

/**
 * Crée ou met à jour un contenu CMS (upsert)
 */
export const upsertContent = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Clé et valeur requises' });
    }
    const valeur = typeof value === 'string' ? value : JSON.stringify(value);
    const config = await prisma.cmsConfig.upsert({
      where: { cle: key },
      update: { valeur },
      create: { cle: key, valeur }
    });
    res.json({ success: true, key: config.cle, message: 'Contenu mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du contenu' });
  }
};

/**
 * Met à jour les traductions d'une langue complète (bulk)
 * body: { locale: 'fr' | 'ar' | 'en', translations: {...} }
 */
export const updateTranslations = async (req: Request, res: Response) => {
  try {
    const { locale, translations } = req.body;
    if (!locale || !translations) {
      return res.status(400).json({ error: 'locale et translations requis' });
    }
    if (!['fr', 'ar', 'en'].includes(locale)) {
      return res.status(400).json({ error: 'Locale invalide (fr, ar, en)' });
    }
    const key = `translations_${locale}`;
    const valeur = JSON.stringify(translations);
    await prisma.cmsConfig.upsert({
      where: { cle: key },
      update: { valeur },
      create: { cle: key, valeur }
    });
    res.json({ success: true, locale, message: `Traductions ${locale} mises à jour` });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des traductions' });
  }
};

/**
 * Supprime un contenu CMS
 */
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    await prisma.cmsConfig.delete({ where: { cle: key } });
    res.json({ success: true, message: 'Contenu supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression du contenu' });
  }
};
