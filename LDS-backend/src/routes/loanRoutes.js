const express = require('express')
const router = express.Router()
const { createLoan, getLoan, deleteLoan } = require('../controllers/loanController')
const { validateLoan } = require('../middleware/validateMiddleware')

router.post('/', validateLoan, createLoan)
router.get('/:id', getLoan)
// DELETE /api/loans/:id            → soft delete
// DELETE /api/loans/:id?hard=true  → hard delete
router.delete('/:id', deleteLoan)

module.exports = router
