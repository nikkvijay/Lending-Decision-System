const crypto = require('crypto')

// Mask PAN for storage: ABCDE1234F → ABCDE****F
const maskPAN = (pan) => {
  if (!pan || pan.length !== 10) return pan
  return pan.slice(0, 5) + '****' + pan.slice(9)
}

// Hash PAN for duplicate detection (SHA-256)
const hashPAN = (pan) => {
  return crypto.createHash('sha256').update(pan.toUpperCase()).digest('hex')
}

module.exports = { maskPAN, hashPAN }
