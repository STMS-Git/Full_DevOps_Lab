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
import infoRoute from './routes/auto/info.route.js'// À décommenter plus tard
import boomRoute from './routes/auto/boom.route.js'// À décommenter plus tard

const app = express()

// Simple root + health endpoints
app.get('/', (_req, res) => res.json({ ok: true, message: 'Hello from CI/CD demo 👋' }))
app.get('/health', (_req, res) => res.status(200).send('OK'))

// Connecter les routes
app.use('/version', versionRoute)
app.use('/info', infoRoute) // À décommenter plus tard
app.use('/boom', boomRoute) // À décommenter plus tard

// Global error middleware last
app.use(errorHandler)

export default app
