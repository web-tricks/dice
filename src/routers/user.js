const express = require('express');

const User = require('../models/user');
const authentication = require('../middleware/auth');
const createServerSeed = require('../utils/serverSeed');

const router = express.Router();

//router to signup user
router.post('/user/signup', async(req, res) => {
    const {username,email,password} = req.body;
    const {seed,seedHash} = createServerSeed();
    const user = new User({
        username,
        email,
        password,
        seed,
        seedHash
    });
    try {
        await user.save();
        const token = await user.createAuthToken();
        res.cookie('auth_token', token, {httpOnly: true});
        res.status(201).send(user);
    } catch(e) {
        const errorMsg = [];
        if (e.errors) {
            Object.values(e.errors).forEach(
                error => errorMsg.push(error.message)
            );
            res.status(400).send(errorMsg);
        } else {
        res.status(400).send([e.message]);
        }
    }
});

//router to login user
router.post('/user/login', async(req, res) => {
    try {
        const user = await User.loginWithCredentials(req.body.username, req.body.password);
        const token = await user.createAuthToken();
        res.cookie('auth_token', token, {httpOnly: true});

        res.send(user);
    } catch(e) {
        res.status(400).send(e.message);
    }
});

//router to logout user
router.post('/user/logout', authentication, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);

        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send(e);
    }
});

//router to retrieve all bets made by the user
router.get('/user/bets', authentication, async(req,res) => {
    try {
        await req.user.populate({
            path: 'bets',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    createdAt: -1
                }
            }
        }).execPopulate();
        res.send(req.user.bets);
    } catch {
        res.status(500).send('Failed to load bets');
    }
});


module.exports = router;
