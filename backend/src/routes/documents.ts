import { Router } from 'express';
import { getPublicDocuments, generateDownloadLink, executeSecureDownload } from '../controllers/documents.controller.js';

const router = Router();

// /api/documents
router.get('/', getPublicDocuments);

// /api/documents/:id/download -> Retourne le token JWT formaté
router.get('/:id/download', generateDownloadLink);

// /api/documents/download-secure?token=XXX -> Exécute le téléchargement final du fichier physique
router.get('/download-secure', executeSecureDownload);

export default router;
