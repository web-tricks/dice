const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentication = async (req,res,next) => {
    try {
        const token = req.cookies['auth_token'];
        const decode = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({_id:decode._id, 'tokens.token': token});

        if (!user) {
            throw new Error;
        }

        req.user = user;
        req.token = token;
        next();
    } catch(e) {  
        return res.status(400).send('Authentication Error');
    }
}

module.exports = authentication;