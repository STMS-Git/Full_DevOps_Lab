/**
 * Express app configuration.
 * Responsibilities:
 *  - Base routes (/, /health)
 *  - Mount routes from src/routes/auto/
 *  - Global error handler (consistent JSON for errors)
 */
import express from 'express'
import { errorHandler } from './utils/errorHandler.js'

// Import of the routes
import versionRoute from './routes/auto/version.route.js'
import infoRoute from './routes/auto/info.route.js'// À décommenter plus tard
import boomRoute from './routes/auto/boom.route.js'// À décommenter plus tard
import matchRoute from './routes/auto/match.route.js'
import trainingRoute from './routes/auto/training.route.js'

const app = express()

// JSON Middlewares
app.use(express.json())

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

// Connecter les routes
app.use('/version', versionRoute)
app.use('/info', infoRoute) // À décommenter plus tard
app.use('/boom', boomRoute) // À décommenter plus tard
app.use('/matches', matchRoute)
app.use('/trainings', trainingRoute)

// Global error middleware last
app.use(errorHandler)

export default app
