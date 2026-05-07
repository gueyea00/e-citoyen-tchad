import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Définition de la destination et du nom des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/others';
    
    // Trie automatique dans les bons dossiers de fonction du type MIME
    if (file.mimetype === 'application/pdf' || file.mimetype.includes('word')) {
      dest = 'uploads/documents';
    } else if (file.mimetype.includes('video')) {
      dest = 'uploads/videos';
    } else if (file.mimetype.includes('image')) {
      dest = 'uploads/images';
    }
    
    const fullPath = path.join(process.cwd(), dest);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite de 100MB
});
