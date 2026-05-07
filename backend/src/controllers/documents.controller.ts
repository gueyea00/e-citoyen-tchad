import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Liste tous les documents publics avec filtres (Service, Type, Langue)
export const getPublicDocuments = async (req: Request, res: Response) => {
  try {
    const { service, type, lang, q } = req.query;
    
    const queryConditions: any = {};
    if (service) queryConditions.service_id = service;
    if (type) queryConditions.format = type;
    if (lang) queryConditions.langues = { has: lang };
    
    if (q) {
      const searchTerm = String(q);
      queryConditions.OR = [
        { titre_fr: { contains: searchTerm, mode: 'insensitive' } },
        { titre_ar: { contains: searchTerm, mode: 'insensitive' } },
        { titre_en: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    const documents = await prisma.document.findMany({
      where: queryConditions,
      orderBy: { updatedAt: 'desc' }
    });

    res.json(documents);
  } catch (error: any) {
    console.error("Erreur getPublicDocuments:", error);
    res.status(500).json({ error: 'Erreur Serveur', details: error?.message || String(error) });
  }
};

// Génère un lien de téléchargement éphémère (10 minutes)
export const generateDownloadLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      return res.status(404).json({ error: 'Document introuvable' });
    }

    const token = jwt.sign({ docId: document.id }, JWT_SECRET, { expiresIn: '10m' });
    // Ce lien sera utilisé par le front
    res.json({ downloadUrl: `/api/documents/download-secure?token=${token}` });
  } catch (error) {
    res.status(500).json({ error: 'Erreur système' });
  }
};

// Exécute le téléchargement via le Token crypté statique
export const executeSecureDownload = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) return res.status(401).send('Lien non autorisé ou expiré.');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { docId: string };
    const document = await prisma.document.findUnique({ where: { id: decoded.docId } });
    
    if (!document) {
       return res.status(404).send('Document inconnu en base de données');
    }

    // On s'assure que le chemin est correct (certains fichiers peuvent commencer par / ou non)
    let cleanPath = document.fichier_url.startsWith('/') 
      ? document.fichier_url.substring(1) 
      : document.fichier_url;
      
    const filePath = path.resolve(process.cwd(), cleanPath);
    
    // Vérifier si le fichier existe physiquement sur le disque
    if (!fs.existsSync(filePath)) {
      console.error(`Fichier physique non trouvé: ${filePath}`);
      return res.status(404).send('Fichier physique non trouvé sur le serveur');
    }

    // Si le paramètre inline est présent, on affiche le fichier au lieu de le télécharger
    if (req.query.inline === 'true') {
      return res.sendFile(filePath);
    }

    // Téléchargement physique du fichier avec son nom d'origine
    res.download(filePath, `${document.titre_fr}.${document.format.toLowerCase()}`);
  } catch (error) {
    console.error('Erreur lors du téléchargement sécurisé:', error);
    res.status(403).send('Lien de téléchargement invalide ou a expiré (limite: 10 minutes).');
  }
};
