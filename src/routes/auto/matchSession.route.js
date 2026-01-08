import express from 'express'
import mongoose from 'mongoose'
import MatchSession from '../../models/MatchSession.js'
import Facility from '../../models/Facility.js'
import Coach from '../../models/Coach.js'
import Team from '../../models/Team.js'

const router = express.Router()

// GET /matchSessions
router.get('/', async (req, res, next) => {
  try {
    const matches = await MatchSession.find()
      .populate('facilityId')
      .populate('coachId')
      .populate('team1Id')
      .populate('team2Id')
      .sort({ eventDate: 1 })

    res.json({ success: true, count: matches.length, data: matches })
  } catch (error) {
    next(error)
  }
})

// GET /matchSessions/:id - Receive a match with an ID
router.get('/:id', async (req, res, next) => {
  try {
    const match = await MatchSession.findById(req.params.id)
      .populate('facilityId')
      .populate('coachId')
      .populate('team1Id')
      .populate('team2Id')

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' })
    }

    res.json({ success: true, data: match })
  } catch (error) {
    next(error)
  }
})

// POST /matchSessions - Create a new match session
router.post('/', async (req, res, next) => {
  try {
    const { eventDate, eventSlot, eventType = 'match', facilityId, coachId, team1Id, team2Id } = req.body

    if (!eventDate || !eventSlot) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    if (!facilityId) {
      return res.status(404).json({ success: false, message: 'The facility with the ID undefined has not been found' })
    }
    if (!mongoose.Types.ObjectId.isValid(facilityId) || !(await Facility.findById(facilityId))) {
      return res.status(404).json({ success: false, message: `The facility with the ID ${facilityId} has not been found` })
    }

    if (!coachId) {
      return res.status(404).json({ success: false, message: 'The coach with the ID undefined has not been found' })
    }
    if (!mongoose.Types.ObjectId.isValid(coachId) || !(await Coach.findById(coachId))) {
      return res.status(404).json({ success: false, message: `The coach with the ID ${coachId} has not been found` })
    }

    if (!team1Id) {
      return res.status(404).json({ success: false, message: 'The first team with the ID undefined has not been found' })
    }
    if (!mongoose.Types.ObjectId.isValid(team1Id) || !(await Team.findById(team1Id))) {
      return res.status(404).json({ success: false, message: `The first team with the ID ${team1Id} has not been found` })
    }

    if (!team2Id) {
      return res.status(404).json({ success: false, message: 'The second team with the ID undefined has not been found' })
    }
    if (!mongoose.Types.ObjectId.isValid(team2Id) || !(await Team.findById(team2Id))) {
      return res.status(404).json({ success: false, message: `The second team with the ID ${team2Id} has not been found` })
    }

    const match = new MatchSession({ eventDate, eventSlot, eventType, facilityId, coachId, team1Id, team2Id })

    // Save it in mangoDB
    await match.save()

    // Remplir les références
    await match.populate('facilityId coachId team1Id team2Id')

    res.status(201).json({ success: true, message: 'Match created successfully', data: match })
  } catch (error) {
    next(error)
  }
})

// PUT /matchSessions/:id - Mettre à jour un match
router.put('/:id', async (req, res, next) => {
  try {
    const { eventDate, eventSlot, eventType, facilityId, coachId, team1Id, team2Id } = req.body

    if (facilityId) {
      if (!mongoose.Types.ObjectId.isValid(facilityId) || !await Facility.findById(facilityId) || !facilityId) {
        return res.status(404).json({ success: false, message: `The facility with the ID ${facilityId} has not been found` })
      }
    }

    if (coachId) {
      if (!mongoose.Types.ObjectId.isValid(coachId) || !await Coach.findById(coachId) || !coachId) {
        return res.status(404).json({ success: false, message: `The coach with the ID ${coachId} has not been found` })
      }
    }

    if (team1Id) {
      if (!mongoose.Types.ObjectId.isValid(team1Id) || !await Team.findById(team1Id) || !team1Id) {
        return res.status(404).json({ success: false, message: `The first team with the ID ${team1Id} has not been found` })
      }
    }

    if (team2Id) {
      if (!mongoose.Types.ObjectId.isValid(team2Id) || !await Team.findById(team2Id) || !team2Id) {
        return res.status(404).json({ success: false, message: `The second team with the ID ${team2Id} has not been found` })
      }
    }

    const match = await MatchSession.findByIdAndUpdate(
      req.params.id,
      { eventDate, eventSlot, eventType, facilityId, coachId, team1Id, team2Id },
      { new: true, runValidators: true }
    )

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' })
    }

    await match.populate('facilityId coachId team1Id team2Id')
    res.json({ success: true, message: 'Match updated successfully', data: match })
  } catch (error) {
    next(error)
  }
})

// DELETE /matchSessions/:id - Supprimer un match
router.delete('/:id', async (req, res, next) => {
  try {
    const match = await MatchSession.findByIdAndDelete(req.params.id)

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' })
    }

    res.json({ success: true, message: 'Match deleted successfully', data: match })
  } catch (error) {
    next(error)
  }
})

export default router
