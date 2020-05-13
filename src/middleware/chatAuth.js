const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentication = async(socket) => {
    try {
        const token = socket.handshake.headers.cookie.split(';')[0].split('=')[1];
        const decode = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({_id:decode._id, 'tokens.token': token});
        return user;
    } catch {
        return undefined;
    }
}

module.exports = authentication;