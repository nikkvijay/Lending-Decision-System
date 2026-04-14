const express = require('express')
const router = express.Router()
const { createLoan, getLoan } = require('../controllers/loanController')
const { validateLoan } = require('../middleware/validateMiddleware')

router.post('/', validateLoan, createLoan)
router.get('/:id', getLoan)

module.exports = router
