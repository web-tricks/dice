const express = require('express');

const Chat = require('../models/chat');
const authentication = require('../middleware/auth');

const router = express.Router();

router.post('/chat/create', authentication, async(req,res) => {
    const {text,created} = req.body;
    try {
        const chat = new Chat({
            text,
            username: req.user.username,
            created
        })
        await chat.save();
        res.send(chat);
    } catch(e) {
        res.status(500).send(e+'Something Went Wrong!');
    }
});

router.get('/chat/messages', async(req,res) => {
    try {
        const messages = await Chat.find({}, null, {sort: {createdAt: -1}}).limit(20);
        res.send(messages.reverse());
    } catch(e) {
        res.status(500).send('Failed to load messages');
    }
    
});

module.exports = router;

