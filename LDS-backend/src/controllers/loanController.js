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

const deleteLoan = async (req, res, next) => {
  try {
    const { id } = req.params
    const hard = req.query.hard === 'true'

    const found = hard
      ? await loanService.hardDeleteLoan(id)
      : await loanService.softDeleteLoan(id)

    if (!found) throw new AppError('Loan not found', 404, 'LOAN_NOT_FOUND')

    res.status(200).json({
      success: true,
      data: { id, deleted: true, type: hard ? 'hard' : 'soft' },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { createLoan, getLoan, deleteLoan }
