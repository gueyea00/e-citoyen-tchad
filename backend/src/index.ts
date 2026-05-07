import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import path from 'path';

// Load environment variables
dotenv.config();


const app = express();
const port = process.env.PORT || 5002;

// Middlewares
app.use(cors({
  origin: [
    'https://e-citoyen-tchad.vercel.app',
    'https://e-citoyen-frontend.onrender.com',
    'http://localhost:8080',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routes
import servicesRouter from './routes/services.js';
import chatbotRouter from './routes/chatbot.js';
import adminRouter from './routes/admin.js';
import documentsRouter from './routes/documents.js';

// Servir les fichiers statiques (images, documents, vidéos)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes publiques
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Antigravity Backend running' });
});

app.use('/api/services', servicesRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/documents', documentsRouter);

// Routes CMS (Admin)
app.use('/api/admin', adminRouter);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`✅ Serveur démarré sur le port ${port}`);
  });
}

export default app;
export { app };
