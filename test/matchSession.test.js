import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import MatchSession from '../src/models/MatchSession.js'
import Facility from '../src/models/Facility.js'
import Coach from '../src/models/Coach.js'
import Team from '../src/models/Team.js'

describe('MatchSession CRUD Operations', () => {
  let facilityId, coachId, team1Id, team2Id
  const fakeID = '507f1f77bcf86cd799439011'

  beforeEach(async () => {
    await MatchSession.deleteMany({})
    await Facility.deleteMany({})
    await Coach.deleteMany({})
    await Team.deleteMany({})

    const facility = await Facility.create({ name: 'Stadium Match', location: 'Paris', capacity: 800, type: 'indoor' })
    facilityId = facility._id.toString()

    const coach = await Coach.create({ firstName: 'Jean', lastName: 'Match', email: 'jean@match.com', phoneNumber: '0635937281' })
    coachId = coach._id.toString()

    const team1 = await Team.create({ name: 'Team One', sport: 'Football', city: 'Paris' })
    team1Id = team1._id.toString()

    const team2 = await Team.create({ name: 'Team Two', sport: 'Football', city: 'Lyon' })
    team2Id = team2._id.toString()
  })

  // ========== CREATE ==========
  describe('POST /matchSessions', () => {
    it('should return 400 if eventDate is missing', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({ eventSlot: 'morning', facilityId, coachId, team1Id, team2Id })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create match session with valid data', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({ eventDate: '2026-06-15T14:00:00Z', eventSlot: 'afternoon', facilityId, coachId, team1Id, team2Id })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.eventSlot).toBe('afternoon')
    })
  })

  // ========== VALIDATION with errors 404 =============
  describe('POST /matchSessions with validation of the entities', () => {
    const base = { eventDate: '2026-06-15T14:00:00Z', eventSlot: 'morning' }
    it('returns 404 error if the Id of the facility is not present', async () => {
      const response = await request(app).post('/matchSessions').send({ ...base, coachId, team1Id, team2Id }).expect(404)
      expect(response.body.message).toBe('The facility with the ID undefined has not been found')
    })

    it('returns 404 error when the Id of the facility is unknown', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({ ...base, facilityId: fakeID, coachId, team1Id, team2Id })
        .expect(404)
      expect(response.body.message).toBe(`The facility with the ID ${fakeID} has not been found`)
    })

    it('returns 404 error if the Id of the coach is not present', async () => {
      const response = await request(app).post('/matchSessions').send({ ...base, facilityId, team1Id, team2Id }).expect(404)
      expect(response.body.message).toBe('The coach with the ID undefined has not been found')
    })

    it('returns 404 error when the Id of the coach is unknown', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({ ...base, facilityId, coachId: fakeID, team1Id, team2Id })
        .expect(404)
      expect(response.body.message).toBe(`The coach with the ID ${fakeID} has not been found`)
    })

    it('returns 404 error if the Id of the first team is not present', async () => {
      const response = await request(app).post('/matchSessions').send({ ...base, facilityId, coachId, team2Id }).expect(404)
      expect(response.body.message).toBe('The first team with the ID undefined has not been found')
    })

    it('returns 404 error when the Id of the first team is unknown', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({ ...base, facilityId, coachId, team1Id: fakeID, team2Id })
        .expect(404)
      expect(response.body.message).toBe(`The first team with the ID ${fakeID} has not been found`)
    })

    it('returns 404 error if the Id of the second team is not present', async () => {
      const response = await request(app).post('/matchSessions').send({ ...base, facilityId, coachId, team1Id }).expect(404)
      expect(response.body.message).toBe('The second team with the ID undefined has not been found')
    })

    it('returns 404 error when the Id of the second team is unknown', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({ ...base, facilityId, coachId, team1Id, team2Id: fakeID })
        .expect(404)
      expect(response.body.message).toBe(`The second team with the ID ${fakeID} has not been found`)
    })
  })

  // ========== READ ==========
  describe('GET /matchSessions', () => {
    it('should return all match sessions', async () => {
      await MatchSession.create([{ eventDate: '2026-07-10T10:00:00Z', eventSlot: 'morning', facilityId, coachId, team1Id, team2Id }])
      const response = await request(app).get('/matchSessions').expect(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.length).toBe(1)
    })
  })

  describe('GET /matchSessions/:id', () => {
    it('should return 404 if match session not found', async () => {
      await request(app).get(`/matchSessions/${fakeID}`).expect(404)
    })

    it('should return the match session when it exists', async () => {
      const match = await MatchSession.create({
        eventDate: '2026-12-07T20:00:00Z',
        eventSlot: 'evening',
        facilityId,
        coachId,
        team1Id,
        team2Id
      })

      const response = await request(app).get(`/matchSessions/${match._id}`).expect(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(match._id.toString())
    })
  })

  // ========== UPDATE ==========
  describe('PUT /matchSessions/:id', () => {
    it('should update match session successfully', async () => {
      const matchSession = await MatchSession.create({
        eventDate: '2026-10-12T10:00:00Z',
        eventSlot: 'morning',
        facilityId,
        coachId,
        team1Id,
        team2Id
      })
      const response = await request(app)
        .put(`/matchSessions/${matchSession._id}`)
        .send({ eventSlot: 'evening', eventDate: '2026-10-12T18:00:00Z' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.eventSlot).toBe('evening')
    })
  })

  // ========== DELETE ==========
  describe('DELETE /matchSessions/:id', () => {
    it('returns an error when DELETE /matchSessions is thrown', async () => {
      vi.spyOn(MatchSession, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Delete failed'))
      const response = await request(app).delete(`/matchSessions/${fakeID}`).expect(500)
      expect(response.body.message).toBe('Delete failed')
      vi.restoreAllMocks()
    })

    it('should delete match session successfully', async () => {
      const matchSession = await MatchSession.create({
        eventDate: '2026-11-20T14:00:00Z',
        eventSlot: 'afternoon',
        facilityId,
        coachId,
        team1Id,
        team2Id
      })
      await request(app).delete(`/matchSessions/${matchSession._id}`).expect(200)
      await request(app).get(`/matchSessions/${matchSession._id}`).expect(404)
    })
  })

  // ========= Error handling ==============
  describe('MatchSession routes to handle the errors', () => {
    it('returns an error when GET /matchSessions is thrown', async () => {
      vi.spyOn(MatchSession, 'find').mockImplementation(() => { throw new Error('DB failure') })
      const response = await request(app).get('/matchSessions').expect(500)
      expect(response.body.message).toBe('DB failure')
      vi.restoreAllMocks()
    })

    it('returns an error when GET /matchSessions/:id is thrown', async () => {
      vi.spyOn(MatchSession, 'findById').mockImplementation(() => { throw new Error('DB error') })
      const response = await request(app).get(`/matchSessions/${fakeID}`).expect(500)
      expect(response.body.message).toBe('DB error')
      vi.restoreAllMocks()
    })

    it('returns an error when POST /matchSessions is thrown', async () => {
      vi.spyOn(MatchSession.prototype, 'save').mockRejectedValueOnce(new Error('Save failed'))
      const response = await request(app)
        .post('/matchSessions')
        .send({ eventDate: '2026-06-15T14:00:00Z', eventSlot: 'afternoon', facilityId, coachId, team1Id, team2Id })
        .expect(500)
      expect(response.body.message).toBe('Save failed')
      vi.restoreAllMocks()
    })

    it('returns an error when PUT /matchSessions is thrown', async () => {
      vi.spyOn(MatchSession, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Update failed'))
      const response = await request(app).put(`/matchSessions/${fakeID}`).send({ eventSlot: 'afternoon' }).expect(500)
      expect(response.body.message).toBe('Update failed')
      vi.restoreAllMocks()
    })

    it('returns an error when the update is done with an invalid facilityId', async () => {
      const match = await MatchSession.create({
        eventDate: '2026-11-20T14:00:00Z',
        eventSlot: 'afternoon',
        facilityId,
        coachId,
        team1Id,
        team2Id
      })
      const response = await request(app).put(`/matchSessions/${match._id}`).send({ facilityId: fakeID }).expect(404)
      expect(response.body.message).toBe(`The facility with the ID ${fakeID} has not been found`)
    })

    it('returns an error when the update is done with an invalid coachId', async () => {
      const match = await MatchSession.create({
        eventDate: '2026-11-20T14:00:00Z',
        eventSlot: 'afternoon',
        facilityId,
        coachId,
        team1Id,
        team2Id
      })
      const response = await request(app).put(`/matchSessions/${match._id}`).send({ coachId: fakeID }).expect(404)
      expect(response.body.message).toBe(`The coach with the ID ${fakeID} has not been found`)
    })

    it('returns an error when the update is done with an invalid team1Id', async () => {
      const match = await MatchSession.create({
        eventDate: '2026-11-20T14:00:00Z',
        eventSlot: 'afternoon',
        facilityId,
        coachId,
        team1Id,
        team2Id
      })
      const response = await request(app).put(`/matchSessions/${match._id}`).send({ team1Id: fakeID }).expect(404)
      expect(response.body.message).toBe(`The first team with the ID ${fakeID} has not been found`)
    })

    it('returns an error when the update is done with an invalid team2Id', async () => {
      const match = await MatchSession.create({
        eventDate: '2026-11-20T14:00:00Z',
        eventSlot: 'afternoon',
        facilityId,
        coachId,
        team1Id,
        team2Id
      })
      const response = await request(app).put(`/matchSessions/${match._id}`).send({ team2Id: fakeID }).expect(404)
      expect(response.body.message).toBe(`The second team with the ID ${fakeID} has not been found`)
    })

    it('returns an error when the update is done with a match that does not exist', async () => {
      const response = await request(app).put(`/matchSessions/${fakeID}`).send({ eventSlot: 'evening' }).expect(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Match not found')
    })
  })
})
