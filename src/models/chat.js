const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    created: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});


//Creating Chat Model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;