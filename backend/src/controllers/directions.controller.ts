import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// ============================================
// CRUD DIRECTIONS
// ============================================

export const getAllDirections = async (req: Request, res: Response) => {
  try {
    const directions = await prisma.direction.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { nom_fr: 'asc' }
    });
    res.json(directions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de récupération des directions' });
  }
};

export const getDirectionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const direction = await prisma.direction.findUnique({
      where: { id },
      include: { services: true }
    });
    if (!direction) return res.status(404).json({ error: 'Direction non trouvée' });
    res.json(direction);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de récupération' });
  }
};

export const createDirection = async (req: Request, res: Response) => {
  try {
    const { nom_fr, nom_ar, nom_en, adresse, telephone, email, horaires, gps_lat, gps_lng } = req.body;
    if (!nom_fr) return res.status(400).json({ error: 'nom_fr requis' });

    const direction = await prisma.direction.create({
      data: { nom_fr, nom_ar, nom_en, adresse, telephone, email, horaires, gps_lat, gps_lng }
    });
    res.status(201).json(direction);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la direction' });
  }
};

export const updateDirection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.direction.update({ where: { id }, data });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la direction' });
  }
};

export const deleteDirection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Vérifie s'il y a des services associés
    const count = await prisma.service.count({ where: { direction_id: id } });
    if (count > 0) {
      return res.status(400).json({ 
        error: `Cette direction a ${count} service(s) associé(s). Réassignez-les avant de supprimer.` 
      });
    }
    await prisma.direction.delete({ where: { id } });
    res.json({ success: true, message: 'Direction supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression' });
  }
};
