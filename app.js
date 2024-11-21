require("dotenv/config");  // Charger les variables d'environnement depuis le fichier .env
require("./db");            // Connexion à la base de données MongoDB
const express = require("express");

const app = express();

// Charger la configuration des middlewares
require("./config")(app);

// 👇 Commencer à gérer les routes ici
app.use("/api/events", require("./routes/event.routes"));  // Routes pour les événements
app.use("/api/donations", require("./routes/donation.routes"));  // Routes pour les donations
app.use("/auth", require("./routes/auth.routes"));  // Routes d'authentification

// Gestion des erreurs globales
require("./error-handling")(app);

module.exports = app;  // Exporter l'application pour l'utiliser dans le serveur
