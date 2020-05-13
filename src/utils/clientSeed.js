const crypto = require('crypto');

module.exports = (field) => {
    let length = Math.floor(Math.random()*8);
    if (length < 4) length = 4;

    const clientSeed = crypto.randomBytes(length).toString('hex');
    
    field.value = clientSeed;
}