import MatchSession from '../models/MatchSession.js'
import Team from '../models/Team.js'
import Facility from '../models/Facility.js'

export async function listMatches (req, res, next) {
  try {
    const sessions = await MatchSession.find()
      .populate('teamId')
      .populate('facilityId')
      .sort({ date: -1 })

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    })
  } catch (error) {
    next(error)
  }
}

export async function getMatchById (req, res, next) {
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

export async function createMatch (req, res, next) {
  try {
    const { eventDate, eventSlot, opponentTeam, teamId, facilityId } = req.body

    if (!eventDate || !eventSlot || !opponentTeam || !teamId || !facilityId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Team with ID ${teamId} not found`
      })
    }

    const facility = await Facility.findById(facilityId)
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: `Facility with ID ${facilityId} not found`
      })
    }

    const match = new MatchSession({
      eventDate,
      eventSlot,
      opponentTeam,
      teamId,
      facilityId,
      eventType: 'match'
    })

    await match.save()
    await match.populate('teamId facilityId')

    res.status(201).json({
      success: true,
      message: 'Match session created successfully',
      data: match
    })
  } catch (error) {
    next(error)
  }
}

export async function updateMatch (req, res, next) {
  try {
    const { eventDate, eventSlot, opponentTeam } = req.body

    const match = await MatchSession.findByIdAndUpdate(
      req.params.id,
      { eventDate, eventSlot, opponentTeam },
      { new: true, runValidators: true }
    )
      .populate('teamId')
      .populate('facilityId')

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match session not found'
      })
    }

    res.json({
      success: true,
      message: 'Match session updated successfully',
      data: match
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteMatch (req, res, next) {
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
