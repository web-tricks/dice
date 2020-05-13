const express = require('express');
const NP = require('number-precision');

const Bet = require('../models/bet');
const User = require('../models/user');
const authentication = require('../middleware/auth');
const createServerSeed = require('../utils/serverSeed');
const findResult = require('../utils/pf');

const router = express.Router();

router.post('/bet/create', authentication, async(req,res) => {
    let start, end, payout;

    //taking inputs from user
    const {amount,rollvalue,rolltype,client} = req.body;

    //validating inputs - amount and client seed
    if (amount > req.user.balance || client.length > 16) return res.status(400).send('Not Enough Money or Wrong Client Seed');

    try {
        //checking if user bet roll under or over 
        if (rolltype === 'under') {
            end = rollvalue;
            start = 0;
            payout = (100/rollvalue).toFixed(4);
        } else if (rolltype === 'over') {
            end = 100;
            start = rollvalue;
            payout = (100/(100-rollvalue)).toFixed(4);
        } else return res.status(400).send('Bad Request');

        //searching for current user seed
        const {seed,seedHash} = await User.findById(req.user._id);

        //using provably fair script to find result
        const {hash, number} = findResult(client,seed);

        //checking if user won or lost
        const isWin = (number > parseInt(start) && number < parseInt(end));

        //if win then add amount else deduct
        const modAmount = NP.times(amount,payout);
        const winAmount = NP.minus(modAmount,amount)
        req.user.balance = isWin ? NP.plus(req.user.balance,winAmount) : NP.minus(req.user.balance,amount);

        //creating new server seed for user
        const newServerSeeds = createServerSeed();
        req.user.seed = newServerSeeds.seed;
        req.user.seedHash = newServerSeeds.seedHash;

        //creating bet
        const bet = new Bet({
            player: req.user._id,
            amount, 
            range: {start,end},
            hash,
            seed, seedHash, client,
            display: {
                choice: rollvalue+' '+rolltype,
                result: number,
                won: isWin ? 'won' : 'lost',
                payout: isWin ? winAmount : `-${amount}`
            }
        });

        //saving bet and user in database
        await bet.save();
        await req.user.save();

        //rendering result to frontend
        res.send({bet, user: req.user});

    } catch(e) {
        res.status(500).send('Something Went Wrong!');
    }
});

//Retrieve newly created single bet
router.get('/user/bet/:id',authentication, async(req,res) => {
    try {
        const _id = req.params.id;
        const bet = await Bet.findOne({_id, player: req.user._id});

        if (!bet) return res.status(400).send('Bad Request');
        res.send(bet);
    } catch {
        res.status(500).send('Failed to load bet');
    }
});


module.exports = router;

