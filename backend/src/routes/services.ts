import { Router } from 'express';
import { getServices, getServiceBySlug, getServiceVideos, getServiceDocuments } from '../controllers/services.controller.js';

const router = Router();

// GET /api/services
router.get('/', getServices);

// GET /api/services/:slug
router.get('/:slug', getServiceBySlug);

// GET /api/services/:id/videos
router.get('/:id/videos', getServiceVideos);

// GET /api/services/:id/documents
router.get('/:id/documents', getServiceDocuments);

export default router;
