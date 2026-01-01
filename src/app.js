/**
 * Express app configuration.
 * Responsibilities:
 *  - Base routes (/, /health)
 *  - Mount routes from src/routes/auto/
 *  - Global error handler (consistent JSON for errors)
 */
import express from 'express'
import { errorHandler } from './utils/errorHandler.js'

// Import des routes
import versionRoute from './routes/auto/version.route.js'
import infoRoute from './routes/auto/info.route.js'
import boomRoute from './routes/auto/boom.route.js'
import matchRoute from './routes/auto/match.route.js'

const app = express()

// Simple root + health endpoints
app.get('/', (_req, res) => res.json({ ok: true, message: 'Hello from CI/CD demo 👋' }))
app.get('/health', (_req, res) => res.status(200).send('OK'))

// Connecter les routes
app.use('/version', versionRoute)
app.use('/info', infoRoute)
app.use('/boom', boomRoute)
app.use('/matches', matchRoute)

// Global error middleware last
app.use(errorHandler)

export default app
