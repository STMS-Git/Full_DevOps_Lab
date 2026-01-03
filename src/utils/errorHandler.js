/**
 * Centralized Express error handler.
 * Ensures consistent JSON error shape across the API.
 */
export function errorHandler (err, _req, res, _next) {
  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: 'Validation error',
      details: Object.values(err.errors).map(e => e.message)
    })
  }
  // Erreur de duplication (code 11000)
  if (err.code === 11000) {
    return res.status(409).json({
      error: true,
      message: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    })
  }
  // ID Mongoose invalide
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: true,
      message: 'Invalid ID format'
    })
  }
  // Erreur générique
  const status = err?.status ?? 500
  const message = err?.message ?? 'Internal Server Error'
  res.status(status).json({ error: true, message })
}
