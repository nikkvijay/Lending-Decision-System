const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const connectDB = require('./src/config/db')
const { connectPostgres } = require('./src/config/postgres')
const profileRoutes = require('./src/routes/profileRoutes')
const loanRoutes = require('./src/routes/loanRoutes')
const decisionRoutes = require('./src/routes/decisionRoutes')
const { errorMiddleware } = require('./src/middleware/errorMiddleware')
const { generalRateLimiter } = require('./src/middleware/rateLimiter')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect databases
connectDB()
connectPostgres()

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(generalRateLimiter)

// Routes
app.use('/api/profiles', profileRoutes)
app.use('/api/loans', loanRoutes)
app.use('/api/decisions', decisionRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global error handler (must be last)
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
