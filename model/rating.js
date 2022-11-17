const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true
    }
});

// we dont need model for this because we dont need _id and _ver

module.exports = ratingSchema;