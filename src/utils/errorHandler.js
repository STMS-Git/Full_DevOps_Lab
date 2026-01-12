/**
 * Centralized Express error handler.
 * Ensures consistent JSON error shape across the API.
 */
export function errorHandler (err, _req, res, _next) {
  // Mangoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: Object.values(err.errors).map(e => e.message)
    })
  }
  // Duplicate error (code 11000)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    })
  }
  // Invalid Mangoose ID
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    })
  }
  // Generic error
  const status = err?.status ?? 500
  const message = err?.message ?? 'Internal Server Error'
  res.status(status).json({ success: false, message })
}
