const express = require('express');
const path = require('path');

const User = require('../models/user');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

//showing admin panel to only admin
router.get('/admin', adminAuth, (req,res) => {
    res.sendFile(path.resolve(__dirname, '../private/admin.html'))
});


//Return the total number of members registered on website
router.get('/users/all', adminAuth, async(req,res) => {
    try {
        const count = await User.countDocuments();
        res.send(count.toString());
    } catch {
        res.status(500).send('NaN');
    }
});

//Return the username of 20 members in ascending order
router.get('/users/details', adminAuth, async(req,res) => {
    try {
        const users = await User.find({}, '_id username').sort({username: 1}).limit(20)
        .skip(parseInt(req.query.skip));
        res.send(users);
    } catch(e) {
        res.status(500).send('Failed to load members');
    }
});

//Show the data of a particular member - Searching with Id
router.get('/user/getinfo/id/:id', adminAuth, async(req,res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(400).send('User not found');
        res.send(user);
    } catch {
        res.status(500).send('Failed to load details');
    }
});

//Show the data of a particular member - Searching with username
router.get('/user/getinfo/username/:username', adminAuth, async(req,res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({username});
        if (!user) return res.status(400).send('User not found');
        res.send(user);
    } catch {
        res.status(500).send('Failed to load details');
    }
});

//Edit the details of the member
router.post('/user/edit/:id', adminAuth, async(req,res) => {
    const updates = Object.keys(req.body);
    const AllowedUpdates = ['balance','password','email','role'];
    const isValidOperation = updates.every(update => AllowedUpdates.includes(update));
    const changeStatus = [];

    if (!isValidOperation) {
        return res.status(400).send('Invalid Changes');
    }
    
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send('User does not exists');

        updates.forEach(update => {
            if (user[update] !== req.body[update]) {
                user[update] = req.body[update];
                changeStatus.push(`${update} has been changed!`);
            } else {
                changeStatus.push(`${update} remains same!`);
            }
        });

        await user.save();
        res.send(changeStatus);
    } catch(e) {
        res.status(500).send('Failed to change details');
    }
});

//Displaying bets made by the user
router.get('/user/allbets/:username', adminAuth, async(req,res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({username});
        if (!user) return res.status(400).send('User not found');

        await user.populate({
            path: 'bets',
            options: {
                limit: 20,
                skip: parseInt(req.query.skip),
            }
        }).execPopulate();

        const bets = user.bets.map(bet => bet.display);

        res.send(bets);
    } catch(e) {
        res.status(500).send('Failed to load bets');
    }
});

module.exports = router;
