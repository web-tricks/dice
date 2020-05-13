const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    player: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    range: {
        start: {
            type: Number,
            required: true
        },
        end: {
            type: Number,
            required: true
        }
    },
    hash: {
        type: String,
        required: true
    },
    seedHash: {
        type: String,
        required: true
    },
    seed: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    display: {
        choice: {
            type: String,
            required: true
        },
        result: {
            type: Number,
            required: true
        },
        won: {
            type: String,
            required: true
        },
        payout: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: true
});

//Creating Bet  Model
const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;