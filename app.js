// Import package express (node server)
const express = require("express");
const app = express();
// Import package moongoose (mongodb)
const mongoose = require("mongoose");
// Accès aux variable dans .env
const dotenv = require("dotenv");
dotenv.config();
// Import des diffèrentes routes
const User = require("./routes/auth");
const Sauces = require("./routes/sauces");
// Permet de se déplacer dans l'arborescence du dossier
const path = require("path");
// Import package helmet
const helmet = require("helmet");
// Import package express rate limit
const rateLimit = require("express-rate-limit");

// Accès aux identifiants mongoDB du .env
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Connection à ma base de donnée mongoDB
mongoose
  .connect(
    `mongodb+srv://` + DB_USER + `:` + DB_PASSWORD + `@` + DB_HOST + ``,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Parse les requêtes en json
app.use(express.json());

// Eviter les erreurs CORS en permettant les requêtes cross-origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Lecture du dossier image
app.use("/images", express.static(path.join(__dirname, "images")));

// Utilisation des routes
app.use("/api/auth", User);
app.use("/api/sauces", Sauces);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());

module.exports = app;
