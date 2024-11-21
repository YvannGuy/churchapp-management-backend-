const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation.models");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/donations - Créer une nouvelle donation
router.post("/donations", isAuthenticated, (req, res) => {
    const { amount, type } = req.body; // Récupérer le montant et le type
    const user = req.payload._id; // Récupérer l'ID de l'utilisateur depuis le jeton authentifié

    // Vérifier les champs requis
    if (!amount || !type) {
        return res.status(400).json({ message: "Le montant et le type sont requis" });
    }

    // Créer une nouvelle donation
    Donation.create({ amount, type, user })
        .then((newDonation) => res.status(201).json(newDonation))
        .catch((err) => {
            console.error("Erreur lors de la création de la donation :", err.message);
            res.status(500).json({ message: "Erreur lors de la création de la donation", error: err.message });
        });
});

// GET /api/donations - Récupérer toutes les donations
router.get("/donations", isAuthenticated, (req, res) => {
    Donation.find()
        .then((donations) => res.status(200).json(donations))
        .catch((err) => {
            console.error("Erreur lors de la récupération des donations :", err.message);
            res.status(500).json({ message: "Erreur lors de la récupération des donations", error: err.message });
        });
});

// GET /api/donations/:id - Récupérer une donation spécifique par ID
router.get("/donations/:id", isAuthenticated, (req, res) => {
    const { id } = req.params;

    Donation.findById(id)
        .then((donation) => {
            if (!donation) {
                return res.status(404).json({ message: "Donation not found" });
            }
            res.status(200).json(donation);
        })
        .catch((err) => {
            console.error("Erreur lors de la récupération de la donation :", err.message);
            res.status(500).json({ message: "Erreur lors de la récupération de la donation", error: err.message });
        });
});

module.exports = router;
