import { upload } from '../middleware/upload.js';

export const uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err || !req.file) {
      return res.status(400).json({ 
        error: 'Erro no upload do arquivo',
        details: err?.message 
      });
    }
    
    res.json({ 
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });
  });
};