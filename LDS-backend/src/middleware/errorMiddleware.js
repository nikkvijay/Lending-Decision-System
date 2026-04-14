const errorMiddleware = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong',
      details: err.details || [],
      timestamp: new Date().toISOString(),
    },
  })
}

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = []) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

module.exports = { errorMiddleware, AppError }
