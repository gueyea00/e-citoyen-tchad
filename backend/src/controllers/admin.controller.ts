import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// ============================================
// CRUD SERVICES DANS LE CMS
// ============================================

export const getAllServicesAdmin = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        direction: true,
        etapes: { orderBy: { ordre: 'asc' } },
        videos: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de récupération des services' });
  }
};

export const createServiceAdmin = async (req: Request, res: Response) => {
  try {
    const {
      slug, titre_fr, titre_ar, titre_en,
      desc_fr, desc_ar, desc_en, direction_id,
      etapes, videos
    } = req.body;

    const newService = await prisma.service.create({
      data: {
        slug: slug.trim(), titre_fr, titre_ar, titre_en,
        desc_fr, desc_ar, desc_en, direction_id,
        etapes: etapes ? {
          create: etapes.map((e: any) => ({
            ordre: parseInt(e.ordre),
            titre_fr: e.titre_fr,
            titre_ar: e.titre_ar,
            titre_en: e.titre_en,
            desc_fr: e.desc_fr,
            desc_ar: e.desc_ar,
            desc_en: e.desc_en,
            duree: e.duree,
            docs_requis: e.docs_requis
          }))
        } : undefined,
        videos: videos ? {
          create: videos.map((v: any) => ({
            langue: v.langue,
            url: v.url,
            type: v.type || 'youtube',
            titre: v.titre
          }))
        } : undefined
      }
    });
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du service' });
  }
};

export const updateServiceAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      slug, titre_fr, titre_ar, titre_en,
      desc_fr, desc_ar, desc_en, direction_id,
      etapes, videos
    } = req.body;

    // Mise à jour transactionnelle pour garantir l'intégrité
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Supprimer les anciennes étapes et vidéos pour les recréer (plus simple que upsert complexe)
      if (etapes) {
        await tx.etapeProcessus.deleteMany({ where: { service_id: id } });
      }
      if (videos) {
        await tx.video.deleteMany({ where: { service_id: id } });
      }

      // 2. Mettre à jour le service et recréer les relations
      return await tx.service.update({
        where: { id },
        data: {
          slug: slug.trim(), titre_fr, titre_ar, titre_en,
          desc_fr, desc_ar, desc_en, direction_id,
          etapes: etapes ? {
            create: etapes.map((e: any) => ({
              ordre: parseInt(e.ordre),
              titre_fr: e.titre_fr,
              titre_ar: e.titre_ar,
              titre_en: e.titre_en,
              desc_fr: e.desc_fr,
              desc_ar: e.desc_ar,
              desc_en: e.desc_en,
              duree: e.duree,
              docs_requis: e.docs_requis
            }))
          } : undefined,
          videos: videos ? {
            create: videos.map((v: any) => ({
              langue: v.langue,
              url: v.url,
              type: v.type || 'youtube',
              titre: v.titre
            }))
          } : undefined
        }
      });
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

export const deleteServiceAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service totalement supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression' });
  }
};

// ============================================
// CRUD DOCUMENTS DANS LE CMS
// ============================================

export const createDocumentAdmin = async (req: Request, res: Response) => {
  try {
    const { titre_fr, titre_ar, titre_en, fichier_url, format, langues, taille, service_id } = req.body;
    const document = await prisma.document.create({
      data: {
        titre_fr, titre_ar, titre_en,
        fichier_url, format, langues, taille, service_id
      }
    });
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du document' });
  }
};

export const deleteDocumentAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.document.delete({ where: { id } });
    res.json({ success: true, message: 'Document supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression de document' });
  }
};
