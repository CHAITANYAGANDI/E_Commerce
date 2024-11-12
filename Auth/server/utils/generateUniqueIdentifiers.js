const crypto = require('crypto');

function generateUniqueId() {
    return crypto.randomBytes(8).toString('hex');
}

function generateUniqueSecret() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = { generateUniqueId, generateUniqueSecret };
