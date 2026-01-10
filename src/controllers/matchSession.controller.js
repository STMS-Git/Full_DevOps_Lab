import MatchSession from '../models/MatchSession.js'

/**
 * List all match sessions with populated fields
 */
export async function listMatchSessions (req, res, next) {
  try {
    const sessions = await MatchSession.find()
      .populate('teamId')
      .populate('facilityId')
      .sort({ date: -1 })

    res.json({
      success: true,
      data: sessions
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get match session by ID
 */
export async function getMatchSessionById (req, res, next) {
  try {
    const session = await MatchSession.findById(req.params.id)
      .populate('teamId')
      .populate('facilityId')

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Match session not found'
      })
    }

    res.json({
      success: true,
      data: session
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete match session by ID
 */
export async function deleteMatchSession (req, res, next) {
  try {
    const session = await MatchSession.findByIdAndDelete(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Match session not found'
      })
    }

    res.json({
      success: true,
      message: 'Match session deleted successfully',
      data: session
    })
  } catch (error) {
    next(error)
  }
}
