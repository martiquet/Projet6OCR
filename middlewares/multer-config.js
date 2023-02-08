// Import package multer
const multer = require("multer");
//Résoudre l'extension de fichier appropriée
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Indiquer à multer ou enregistrer les images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Utiliser nom d'origine, remplacer " " par "_"
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
// Export de multer entièrement configurer
module.exports = multer({ storage: storage }).single("image");
