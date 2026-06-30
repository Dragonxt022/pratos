const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = process.env.UPLOADS_PATH
  ? path.resolve(process.env.UPLOADS_PATH)
  : path.resolve(__dirname, '..', 'public', 'uploads', 'pratos');
fs.mkdirSync(uploadsDir, { recursive: true });

// CSV fica em memoria - e so texto, processado e descartado pelo controller.
const uploadCSV = multer({ storage: multer.memoryStorage() });

// Foto do prato vai direto para public/uploads/pratos.
const uploadImagem = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      const codigo = req.params.codigo || 'prato';
      cb(null, `${codigo}-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadCSV, uploadImagem };
