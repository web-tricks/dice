const crypto = require('crypto');

module.exports = () => {
    const seed = crypto.randomBytes(24).toString('hex');
    const seedHash = crypto.createHash('sha256').update(seed).digest('hex');

    return {
        seed, seedHash
    }
}