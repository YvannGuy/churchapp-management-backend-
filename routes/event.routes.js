const express = require("express");
const Event = require("../models/Event.models");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware"); // Assurez-vous d'importer la middleware d'authentification
const router = express.Router();

// Middleware pour vérifier que l'utilisateur est un admin
const isAdmin = (req, res, next) => {

    const userId = req.payload._id;

    User.findById(userId)
        .then((userDetails) => {
            if(userDetails.role === "ADMIN") {
                next(); // continue
            } else  {
                return res.status(403).json({ message: "Access denied. Only admins are allowed." });
            }
        })
        .catch((err) => res.status(500).json({ message: "Access denied." }));

};


// CREATE (POST) /api/events - Créer un nouvel événement
router.post("/events", isAuthenticated, isAdmin, (req, res) => {
    const { title, description, date, location } = req.body;
    const createdBy = req.payload._id; // Utiliser l'id de l'utilisateur connecté

    if (!title || !description || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }

    Event.create({ title, description, date, location, createdBy })
        .then((newEvent) => res.status(201).json(newEvent))
        .catch((err) => {
            console.error("Error creating event:", err.message); // Affiche l'erreur dans la console
            res.status(500).json({ message: "Error creating event", error: err.message });
        });
});

// READ (GET) /api/events - Récupérer tous les événements
router.get("/events", (req, res) => {
    Event.find()
        .then((events) => res.status(200).json(events))
        .catch((err) => res.status(500).json({ message: "Error fetching events", error: err }));
});

// GET /events/:id - Récupérer un événement par ID
router.get("/events/:id", isAuthenticated, (req, res) => {
    const { id } = req.params;
    Event.findById(id)
        .then((event) => {
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.status(200).json(event);
        })
        .catch((err) => res.status(500).json({ message: "Error fetching event", error: err }));
});

// UPDATE (PUT) /events/:id - Mettre à jour un événement par ID
router.put("/events/:id", isAuthenticated, isAdmin, (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }

    Event.findByIdAndUpdate(id, { title, description, date }, { new: true })
        .then((updatedEvent) => {
            if (!updatedEvent) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.status(200).json(updatedEvent);
        })
        .catch((err) => res.status(500).json({ message: "Error updating event", error: err }));
});

// DELETE /events/:id - Supprimer un événement par ID
router.delete("/events/:id", isAuthenticated, isAdmin, (req, res) => {
    const { id } = req.params;

    Event.findByIdAndDelete(id)
        .then((deletedEvent) => {
            if (!deletedEvent) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.status(200).json({ message: "Event deleted successfully" });
        })
        .catch((err) => res.status(500).json({ message: "Error deleting event", error: err }));
});

module.exports = router;