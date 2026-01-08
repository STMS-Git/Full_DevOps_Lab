import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import TrainingSession from '../src/models/TrainingSession.js'
import Facility from '../src/models/Facility.js'
import Coach from '../src/models/Coach.js'
import Team from '../src/models/Team.js'

describe('TrainingSession CRUD Operations', () => {
  let trainingSessionId, facilityId, coachId, teamId
  const fakeID = '507f1f77bcf86cd799439011'

  beforeEach(async () => {
    await TrainingSession.deleteMany({})
    await Facility.deleteMany({})
    await Coach.deleteMany({})
    await Team.deleteMany({})

    const facility = await Facility.create({ name: 'Training Center', location: 'Paris', capacity: 300, type: 'indoor' })
    facilityId = facility._id.toString()

    const coach = await Coach.create({ firstName: 'Marie', lastName: 'Training', email: 'marie@training.com', phoneNumber: '0639876567' })
    coachId = coach._id.toString()

    const team = await Team.create({ name: 'Training Team', sport: 'Rugby', city: 'Paris' })
    teamId = team._id.toString()
  })

  // ========== CREATE ==========
  describe('POST /trainingSessions', () => {
    it('should return 400 if duration is missing', async () => {
      const response = await request(app)
        .post('/trainingSessions')
        .send({ eventDate: '2026-06-10T10:00:00Z', eventSlot: 'morning', facilityId, coachId, teamId })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create training session with valid data', async () => {
      const response = await request(app)
        .post('/trainingSessions')
        .send({ eventDate: '2026-06-10T10:00:00Z', eventSlot: 'morning', duration: 90, facilityId, coachId, teamId })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.duration).toBe(90)
      expect(response.body.data.facilityId._id).toBe(facilityId)
      trainingSessionId = response.body.data._id
    })

    it('returns 404 error if the ID of the facility is unknown', async () => {
      const response = await request(app)
        .post('/trainingSessions')
        .send({ eventDate: '2026-06-10T10:00:00Z', eventSlot: 'morning', duration: 90, facilityId: fakeID, coachId, teamId })
        .expect(404)

      expect(response.body.message).toBe(`Facility with ID ${fakeID} not found`)
    })

    it('returns 404 error if the ID of the coach is unknown', async () => {
      const response = await request(app)
        .post('/trainingSessions')
        .send({ eventDate: '2026-06-10T10:00:00Z', eventSlot: 'morning', duration: 90, facilityId, coachId: fakeID, teamId })
        .expect(404)

      expect(response.body.message).toBe(`Coach with ID ${fakeID} not found`)
    })

    it('returns 404 error if the ID of the team is unknown', async () => {
      const response = await request(app)
        .post('/trainingSessions')
        .send({ eventDate: '2026-06-10T10:00:00Z', eventSlot: 'morning', duration: 90, facilityId, coachId, teamId: fakeID })
        .expect(404)

      expect(response.body.message).toBe(`Team with ID ${fakeID} not found`)
    })

    it('returns 500 error if the save has not worked', async () => {
      vi.spyOn(TrainingSession.prototype, 'save').mockRejectedValueOnce(new Error('Save failed'))
      const response = await request(app)
        .post('/trainingSessions')
        .send({ eventDate: '2026-06-10T10:00:00Z', eventSlot: 'morning', duration: 90, facilityId, coachId, teamId })
        .expect(500)

      expect(response.body.message).toBe('Save failed')
      vi.restoreAllMocks()
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /trainingSessions', () => {
    beforeEach(async () => {
      await TrainingSession.create([
        { eventDate: '2026-07-15T09:00:00Z', eventSlot: 'morning', duration: 60, facilityId, coachId, teamId },
        { eventDate: '2026-08-20T14:00:00Z', eventSlot: 'afternoon', duration: 120, facilityId, coachId, teamId }
      ])
    })

    it('should return all training sessions', async () => {
      const response = await request(app).get('/trainingSessions').expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })

    it('returns 500 error if the find has been thrown', async () => {
      vi.spyOn(TrainingSession, 'find').mockImplementation(() => { throw new Error('DB failure') })
      const response = await request(app).get('/trainingSessions').expect(500)
      expect(response.body.message).toBe('DB failure')
      vi.restoreAllMocks()
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /trainingSessions/:id', () => {
    beforeEach(async () => {
      const trainingSession = await TrainingSession.create({
        eventDate: '2026-09-10T10:00:00Z',
        eventSlot: 'morning',
        duration: 75,
        facilityId,
        coachId,
        teamId
      })
      trainingSessionId = trainingSession._id.toString()
    })

    it('should return 404 if training session not found', async () => {
      const response = await request(app).get('/trainingSessions/507f1f77bcf86cd799439011').expect(404)
      expect(response.body.success).toBe(false)
    })

    it('should return training session by id', async () => {
      const response = await request(app).get(`/trainingSessions/${trainingSessionId}`).expect(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(trainingSessionId)
      expect(response.body.data.duration).toBe(75)
    })

    it('returns 500 error if the findById has been thrown', async () => {
      vi.spyOn(TrainingSession, 'findById').mockImplementation(() => { throw new Error('DB error') })
      const response = await request(app).get(`/trainingSessions/${trainingSessionId}`).expect(500)
      expect(response.body.message).toBe('DB error')
      vi.restoreAllMocks()
    })
  })

  // ========== UPDATE ==========
  describe('PUT /trainingSessions/:id', () => {
    beforeEach(async () => {
      const trainingSession = await TrainingSession.create({
        eventDate: '2026-10-05T11:00:00Z',
        eventSlot: 'morning',
        duration: 90,
        facilityId,
        coachId,
        teamId
      })
      trainingSessionId = trainingSession._id.toString()
    })

    it('should return 404 if training session not found', async () => {
      const response = await request(app).put('/trainingSessions/507f1f77bcf86cd799439011').send({ duration: 100 }).expect(404)
      expect(response.body.success).toBe(false)
    })

    it('should update training session successfully', async () => {
      const response = await request(app).put(`/trainingSessions/${trainingSessionId}`)
        .send({ duration: 120, eventSlot: 'afternoon' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.duration).toBe(120)
      expect(response.body.data.eventSlot).toBe('afternoon')
    })

    it('returns 500 error if the findByIdAndUpdate has been thrown', async () => {
      vi.spyOn(TrainingSession, 'findByIdAndUpdate').mockImplementation(() => { throw new Error('Update failed') })
      const response = await request(app).put(`/trainingSessions/${trainingSessionId}`).send({ duration: 100 }).expect(500)
      expect(response.body.message).toBe('Update failed')
      vi.restoreAllMocks()
    })
  })

  // ========== DELETE ==========
  describe('DELETE /trainingSessions/:id', () => {
    beforeEach(async () => {
      const trainingSession = await TrainingSession.create({
        eventDate: '2026-11-15T10:00:00Z',
        eventSlot: 'morning',
        duration: 60,
        facilityId,
        coachId,
        teamId
      })
      trainingSessionId = trainingSession._id.toString()
    })

    it('should return 404 if training session not found', async () => {
      const response = await request(app).delete('/trainingSessions/507f1f77bcf86cd799439011').expect(404)
      expect(response.body.success).toBe(false)
    })

    it('should delete training session successfully', async () => {
      const response = await request(app).delete(`/trainingSessions/${trainingSessionId}`).expect(200)
      expect(response.body.success).toBe(true)

      const checkResponse = await request(app).get(`/trainingSessions/${trainingSessionId}`).expect(404)
      expect(checkResponse.body.success).toBe(false)
    })

    it('returns 500 error if the findByIdAndDelete has been thrown', async () => {
      vi.spyOn(TrainingSession, 'findByIdAndDelete').mockImplementation(() => { throw new Error('Delete failed') })
      const response = await request(app).delete(`/trainingSessions/${trainingSessionId}`).expect(500)
      expect(response.body.message).toBe('Delete failed')
      vi.restoreAllMocks()
    })
  })
})
