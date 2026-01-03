import express from 'express'
import MatchSession from '../../models/MatchSession.js'
import Facility from '../../models/Facility.js'
import Coach from '../../models/Coach.js'
import Team from '../../models/Team.js'

const router = express.Router()

// GET /matchSessions - Récupérer tous les matchs
router.get('/', async (req, res, next) => {
  try {
    const matches = await MatchSession.find()
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')
      .sort({ eventDate: 1 })

    res.json({
      success: true,
      count: matches.length,
      data: matches
    })
  } catch (error) {
    next(error)
  }
})

// GET /matchSessions/:id - Récupérer un match par ID
router.get('/:id', async (req, res, next) => {
  try {
    const match = await MatchSession.findById(req.params.id)
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      })
    }

    res.json({
      success: true,
      data: match
    })
  } catch (error) {
    next(error)
  }
})

// POST /matchSessions - Créer un nouveau match
router.post('/', async (req, res, next) => {
  try {
    const {
      eventDate,
      eventSlot,
      eventType = 'match',
      facilityId,
      coachId,
      teamId
    } = req.body

    // Validation basique
    if (!eventDate || !eventSlot || !facilityId || !coachId || !teamId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }
    // Vérifier que la facility existe
    const facility = await Facility.findById(facilityId)
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: `Facility with ID ${facilityId} not found`
      })
    }

    // Vérifier que le coach existe
    const coach = await Coach.findById(coachId)
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: `Coach with ID ${coachId} not found`
      })
    }

    // Vérifier que la team existe
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Team with ID ${teamId} not found`
      })
    }

    // Créer le nouveau match
    const match = new MatchSession({
      eventDate,
      eventSlot,
      eventType,
      facilityId,
      coachId,
      teamId
    })

    // Sauvegarder dans MongoDB
    await match.save()

    // Remplir les références
    await match.populate('facilityId coachId teamId')

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      data: match
    })
  } catch (error) {
    next(error)
  }
})

// PUT /matchSessions/:id - Mettre à jour un match
router.put('/:id', async (req, res, next) => {
  try {
    const { eventDate, eventSlot, eventType } = req.body

    const match = await MatchSession.findByIdAndUpdate(
      req.params.id,
      {
        eventDate,
        eventSlot,
        eventType
      },
      { new: true, runValidators: true }
    )
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      })
    }

    res.json({
      success: true,
      message: 'Match updated successfully',
      data: match
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /matchSessions/:id - Supprimer un match
router.delete('/:id', async (req, res, next) => {
  try {
    const match = await MatchSession.findByIdAndDelete(req.params.id)

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      })
    }

    res.json({
      success: true,
      message: 'Match deleted successfully',
      data: match
    })
  } catch (error) {
    next(error)
  }
})

export default router
