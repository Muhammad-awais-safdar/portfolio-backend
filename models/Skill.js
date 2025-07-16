const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    percentage: { 
        type: Number, 
        required: true,
        min: 0,
        max: 100 
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient querying by userId
skillSchema.index({ userId: 1 });

module.exports = mongoose.model("Skill", skillSchema);
