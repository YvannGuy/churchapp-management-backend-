const mongoose = require('mongoose');

// Définir le schéma de l'événement
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Mettre à jour `updatedAt` à chaque fois qu'un événement est mis à jour
eventSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Créer et exporter le modèle Event
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
