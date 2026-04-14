const { AppError } = require('../middleware/errorMiddleware')
const loanService = require('../services/loanService')

const createLoan = async (req, res, next) => {
  try {
    const loan = await loanService.createLoan(req.body)
    res.status(201).json({ success: true, data: loan })
  } catch (err) {
    next(err)
  }
}

const getLoan = async (req, res, next) => {
  try {
    const loan = await loanService.getLoanById(req.params.id)
    if (!loan) throw new AppError('Loan not found', 404, 'LOAN_NOT_FOUND')
    res.status(200).json({ success: true, data: loan })
  } catch (err) {
    next(err)
  }
}

module.exports = { createLoan, getLoan }
