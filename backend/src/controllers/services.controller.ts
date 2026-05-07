import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getServices = async (req: Request, res: Response) => {
  try {
    const { q, lang, direction } = req.query;

    const queryConditions: any = {};
    if (direction) queryConditions.direction_id = direction;
    if (q) {
      if (lang === 'ar') queryConditions.titre_ar = { contains: String(q), mode: 'insensitive' };
      else if (lang === 'en') queryConditions.titre_en = { contains: String(q), mode: 'insensitive' };
      else queryConditions.titre_fr = { contains: String(q), mode: 'insensitive' };
    }

    const services = await prisma.service.findMany({
      where: queryConditions,
      include: {
        direction: true,
      },
    });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des services' });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    // First, try to find by exact slug match
    let service = await prisma.service.findUnique({
      where: { slug },
      include: {
        direction: true,
        etapes: { orderBy: { ordre: 'asc' } },
        videos: true,
        documents: true,
      },
    });

    // If not found, try finding with a trimmed slug (in case of trailing spaces in DB or URL)
    if (!service) {
      service = await prisma.service.findFirst({
        where: {
          OR: [
            { slug: slug.trim() },
            { slug: { equals: slug.trim(), mode: 'insensitive' } }
          ]
        },
        include: {
          direction: true,
          etapes: { orderBy: { ordre: 'asc' } },
          videos: true,
          documents: true,
        },
      });
    }

    if (!service) return res.status(404).json({ error: 'Service non trouvé' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getServiceVideos = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lang } = req.query;

    const videos = await prisma.video.findMany({
      where: { 
        service_id: id,
        ...(lang ? { langue: String(lang) } : {})
      },
    });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des vidéos' });
  }
};

export const getServiceDocuments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const documents = await prisma.document.findMany({
      where: { service_id: id },
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' });
  }
};
