const crypto = require('crypto');

function generateUniqueId() {
    return crypto.randomBytes(32).toString('hex');
}

function generateUniqueSecret() {
    return crypto.randomBytes(32).toString('hex');
}

module.exports = { generateUniqueId, generateUniqueSecret };
