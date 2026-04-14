const express = require('express')
const router = express.Router()
const { createProfile, getProfile } = require('../controllers/profileController')
const { validateProfile } = require('../middleware/validateMiddleware')

router.post('/', validateProfile, createProfile)
router.get('/:id', getProfile)

module.exports = router
