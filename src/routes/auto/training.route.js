/* eslint-disable camelcase */
import express from 'express'
import TrainingSession from '../../models/TrainingSession'

const router = express.Router()
const trainings = []

function findAllAvailableFacilities (list_events, slot, date) {
  const IDsbusyFacilities = list_events.filter(e => e.slot_event === slot && e.date_event === date).map(e => e.facilityID_event)
  return facilities.filter(f => !IDsbusyFacilities.includes(f.id))
}

router.get('/available-facilities', (request, response) => {
  if (!request.user || request.user.role !== 'coach') {
    return response.status(403).json({ message: 'Coaches are the only ones that can schedule sessions' })
  }

  const { date_event, slot_event } = request.query
  if (!slot_event || !date_event) {
    return response.status(400).json({ message: 'The date and slot of the events are needed' })
  }

  const available = findAllAvailableFacilities(trainings, slot_event, date_event)
  if (available.length === 0) {
    return response.json({ message: 'No facility for this slot', facilities: [] })
  } else {
    return response.json({ facilities: available })
  }
})

router.post('/', (request, response) => {
  if (!request.user || request.user.role !== 'coach') {
    return response.status(403).json({ message: 'Coaches are the only ones that can schedule sessions' })
  }

  const { date_event, slot_event, facilityID } = request.body

  if (!date_event || !slot_event || typeof facilityID !== 'number') {
    return response.status(400).json({ message: "The date and slot of the events and the facility's ID are needed" })
  }

  const facility = findAllAvailableFacilities(trainings, slot_event, date_event).find(f => f.id === facilityID)
  if (!facility) {
    return response.status(400).json({ message: "This facility can't be chosen" })
  }

  const newevent = new TrainingSession({ date_event, slot_event, facilityID_event: facilityID, coachId_event: request.user.id })
  trainings.push(newevent)
  response.status(201).json(newevent)
})

export default router
