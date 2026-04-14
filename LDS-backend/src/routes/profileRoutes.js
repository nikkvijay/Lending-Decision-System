const express = require('express')
const router = express.Router()
const { createProfile, getProfile, deleteProfile } = require('../controllers/profileController')
const { validateProfile } = require('../middleware/validateMiddleware')

router.post('/', validateProfile, createProfile)
router.get('/:id', getProfile)
// DELETE /api/profiles/:id        → soft delete
// DELETE /api/profiles/:id?hard=true → hard delete
router.delete('/:id', deleteProfile)

module.exports = router
