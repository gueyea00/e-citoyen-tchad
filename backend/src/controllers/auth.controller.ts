import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier les données envoyées
    if (!email || !password) {
      return res.status(400).json({ error: 'L\'email et le mot de passe sont requis' });
    }

    // Récupérer l'utilisateur
    const admin = await prisma.adminUser.findUnique({ 
      where: { email } 
    });

    if (!admin || !admin.actif) {
      return res.status(401).json({ error: 'Identifiants invalides ou compte inactif' });
    }

    // Vérifier le mot de passe (Hash)
    const isMatch = await bcrypt.compare(password, admin.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer le JWT
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Mettre à jour la date de dernière connexion
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { derniere_conn: new Date() }
    });

    res.json({ 
      token, 
      user: {
        email: admin.email,
        role: admin.role
      } 
    });
  } catch (error) {
    console.error('Erreur lors du login CMS:', error);
    res.status(500).json({ error: 'Erreur Serveur Interne' });
  }
};
