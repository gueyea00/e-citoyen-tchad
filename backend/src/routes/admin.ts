import { Router } from 'express';
import { loginAdmin } from '../controllers/auth.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.middleware.js';
import { 
  getAllServicesAdmin, 
  createServiceAdmin, 
  updateServiceAdmin, 
  deleteServiceAdmin,
  createDocumentAdmin,
  deleteDocumentAdmin
} from '../controllers/admin.controller.js';
import {
  getAllContent,
  getContentByKey,
  upsertContent,
  updateTranslations,
  deleteContent
} from '../controllers/content.controller.js';
import {
  getAllDirections,
  getDirectionById,
  createDirection,
  updateDirection,
  deleteDirection
} from '../controllers/directions.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// ===================================
// ROUTES PUBLIQUES (CMS - Lecture seule)
// ===================================
router.post('/login', loginAdmin);

// Lecture publique des contenus/textes pour le frontend
router.get('/content', getAllContent);
router.get('/content/:key', getContentByKey);

// ===================================
// ROUTES SÉCURISÉES (Nécessite JWT)
// ===================================
router.use(verifyJWT);

// Upload sécurisé de fichiers CMS
router.post('/upload', requireRole(['SUPER_ADMIN', 'EDITEUR']), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier transmis' });
  res.json({ 
    message: 'Fichier uploadé', 
    url: req.file.path.replace(/\\/g, '/')
  });
});

// CRUD Services
router.get('/services', requireRole(['SUPER_ADMIN', 'EDITEUR', 'LECTEUR']), getAllServicesAdmin);
router.post('/services', requireRole(['SUPER_ADMIN', 'EDITEUR']), createServiceAdmin);
router.put('/services/:id', requireRole(['SUPER_ADMIN', 'EDITEUR']), updateServiceAdmin);
router.delete('/services/:id', requireRole(['SUPER_ADMIN']), deleteServiceAdmin);

// CRUD Directions
router.get('/directions', requireRole(['SUPER_ADMIN', 'EDITEUR', 'LECTEUR']), getAllDirections);
router.get('/directions/:id', requireRole(['SUPER_ADMIN', 'EDITEUR', 'LECTEUR']), getDirectionById);
router.post('/directions', requireRole(['SUPER_ADMIN', 'EDITEUR']), createDirection);
router.put('/directions/:id', requireRole(['SUPER_ADMIN', 'EDITEUR']), updateDirection);
router.delete('/directions/:id', requireRole(['SUPER_ADMIN']), deleteDirection);

// CRUD Documents
router.post('/documents', requireRole(['SUPER_ADMIN', 'EDITEUR']), createDocumentAdmin);
router.delete('/documents/:id', requireRole(['SUPER_ADMIN', 'EDITEUR']), deleteDocumentAdmin);

// Gestion des contenus / textes du site
router.put('/content/:key', requireRole(['SUPER_ADMIN', 'EDITEUR']), upsertContent);
router.delete('/content/:key', requireRole(['SUPER_ADMIN']), deleteContent);
router.put('/content/translations/update', requireRole(['SUPER_ADMIN', 'EDITEUR']), updateTranslations);

export default router;
