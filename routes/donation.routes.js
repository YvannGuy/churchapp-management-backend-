const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation.models");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/donations - Create a new donation
router.post("/donations", isAuthenticated, (req, res) => {
    const { amount, type } = req.body; // Get amount and type
    const user = req.payload._id; // Get user ID from the authenticated token

    // Validate required fields
    if (!amount || !type) {
        return res.status(400).json({ message: "Amount and type are required" });
    }

    // Create a new donation
    Donation.create({ amount, type, user })
        .then((newDonation) => res.status(201).json(newDonation))
        .catch((err) => {
            console.error("Error creating donation:", err.message);
            res.status(500).json({ message: "Error creating donation", error: err.message });
        });
});

// GET /api/donations - Retrieve all donations for the logged-in user
router.get("/donations/:id", isAuthenticated, (req, res) => {
    const user = req.payload._id; // Get user ID from the authenticated token

    Donation.find({ user })
        .then((donations) => res.status(200).json(donations))
        .catch((err) => {
            console.error("Error fetching donations:", err.message);
            res.status(500).json({ message: "Error fetching donations", error: err.message });
        });
});

module.exports = router;
