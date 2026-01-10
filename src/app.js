/**
 * Express app configuration.
 * Responsibilities:
 *  - Base routes (/, /health)
 *  - Mount routes from src/routes/auto/
 *  - Global error handler (consistent JSON for errors)
 *  - MongoDB routes for Facility, Coach, Team, MatchSession, TrainingSession
 */
import express from 'express'
import { errorHandler } from './utils/errorHandler.js'

// Import of the routes
import versionRoute from './routes/auto/version.route.js'
import infoRoute from './routes/auto/info.route.js' // À décommenter plus tard
import boomRoute from './routes/auto/boom.route.js' // À décommenter plus tard

// MongoDB routes (NEW)
import facilityRoute from './routes/auto/facility.route.js'
import coachRoute from './routes/auto/coach.route.js'
import teamRoute from './routes/auto/team.route.js'
import matchSessionRoute from './routes/auto/matchSession.route.js'
import trainingSessionRoute from './routes/auto/trainingSession.route.js'
import authRoute from './routes/auto/auth.route.js'

const app = express()

// JSON Middlewares
app.use(express.json())

// Authentication middleware
app.use((req, _res, next) => {
  const authentificationuser = req.headers.authorization || ''
  if (authentificationuser === 'Bearer coach-token') {
    req.user = { id: 1, role: 'coach' }
  } else if (authentificationuser === 'Bearer player-token') {
    req.user = { id: 2, role: 'player' }
  } else {
    req.user = null
  }
  next()
})

// Simple root + health endpoints
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Hello from CI/CD demo' })
})

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

// Routes existantes
app.use('/version', versionRoute)
app.use('/info', infoRoute)
app.use('/boom', boomRoute)

// MongoDB Routes (NEW)
app.use('/facilities', facilityRoute)
app.use('/coaches', coachRoute)
app.use('/teams', teamRoute)
app.use('/matchSessions', matchSessionRoute)
app.use('/trainingSessions', trainingSessionRoute)
app.use('/auth', authRoute)

// Global error middleware last
app.use(errorHandler)

export default app
