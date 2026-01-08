import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Team from '../src/models/Team.js'
import sinon from 'sinon'

describe('Team CRUD Operations', () => {
  let teamId

  beforeEach(async () => {
    await Team.deleteMany({})
  })

  // ========== CREATE ==========
  describe('POST /teams', () => {
    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/teams')
        .send({ sport: 'Football', city: 'Paris' })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create team with valid data', async () => {
      const response = await request(app)
        .post('/teams')
        .send({
          name: 'Paris United',
          sport: 'Football',
          city: 'Paris'
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Paris United')
      expect(response.body.data.sport).toBe('Football')
      teamId = response.body.data._id
    })

    it('should return the next error if the save could not have been done', async () => {
      const s = sinon.stub(Team.prototype, 'save').rejects(new Error('DB error'))
      const response = await request(app).post('/teams').send({ name: 'Error team', sport: 'Football' }).expect(500)
      expect(response.body.error).toBe(true)
      expect(response.body.message).toBe('DB error')
      s.restore()
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /teams', () => {
    beforeEach(async () => {
      await Team.create([
        { name: 'Lyon Masters', sport: 'Basketball', city: 'Lyon' },
        { name: 'Marseille FC', sport: 'Football', city: 'Marseille' }
      ])
    })

    it('should return all teams', async () => {
      const response = await request(app)
        .get('/teams')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })

    it('should return the next error if the find could not have been done', async () => {
      const fake = { populate: sinon.stub().returnsThis(), sort: sinon.stub().rejects(new Error('DB error')) }
      const s = sinon.stub(Team, 'find').returns(fake)
      const response = await request(app).get('/teams').expect(500)
      expect(response.body.error).toBe(true)
      expect(response.body.message).toBe('DB error')
      s.restore()
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /teams/:id', () => {
    beforeEach(async () => {
      const team = await Team.create({
        name: 'Toulouse Team',
        sport: 'Rugby',
        city: 'Toulouse'
      })
      teamId = team._id.toString()
    })

    it('should return 404 if team not found', async () => {
      const response = await request(app)
        .get('/teams/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return team by id', async () => {
      const response = await request(app)
        .get(`/teams/${teamId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(teamId)
      expect(response.body.data.name).toBe('Toulouse Team')
    })

    it('should return the next error if the findById could not have been done', async () => {
      const fake = { populate: sinon.stub().throws(new Error('DB error')) }
      const s = sinon.stub(Team, 'findById').returns(fake)
      const response = await request(app).get(`/teams/${teamId}`).expect(500)
      expect(response.body.error).toBe(true)
      expect(response.body.message).toBe('DB error')
      s.restore()
    })
  })

  // ========== UPDATE ==========
  describe('PUT /teams/:id', () => {
    beforeEach(async () => {
      const team = await Team.create({
        name: 'Old Team',
        sport: 'Volleyball',
        city: 'Nice'
      })
      teamId = team._id.toString()
    })

    it('should return 404 if team not found', async () => {
      const response = await request(app)
        .put('/teams/507f1f77bcf86cd799439011')
        .send({ name: 'Updated' })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should update team successfully', async () => {
      const response = await request(app)
        .put(`/teams/${teamId}`)
        .send({
          name: 'New Team',
          city: 'Bordeaux'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('New Team')
      expect(response.body.data.city).toBe('Bordeaux')
    })

    it('should return the next error if the findByIdAndUpdate could not have been done', async () => {
      const fake = { populate: sinon.stub().throws(new Error('DB error')) }
      const s = sinon.stub(Team, 'findByIdAndUpdate').returns(fake)
      const response = await request(app).put(`/teams/${teamId}`).send({ name: 'Fail team' }).expect(500)
      expect(response.body.error).toBe(true)
      expect(response.body.message).toBe('DB error')
      s.restore()
    })
  })

  // ========== DELETE ==========
  describe('DELETE /teams/:id', () => {
    beforeEach(async () => {
      const team = await Team.create({
        name: 'Delete Team',
        sport: 'Rugby',
        city: 'Nantes'
      })
      teamId = team._id.toString()
    })

    it('should return 404 if team not found', async () => {
      const response = await request(app)
        .delete('/teams/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should delete team successfully', async () => {
      const response = await request(app)
        .delete(`/teams/${teamId}`)
        .expect(200)

      expect(response.body.success).toBe(true)

      const checkResponse = await request(app)
        .get(`/teams/${teamId}`)
        .expect(404)

      expect(checkResponse.body.success).toBe(false)
    })

    it('should return the next error if the findByIdAndDelete could not have been done', async () => {
      const s = sinon.stub(Team, 'findByIdAndDelete').rejects(new Error('DB error'))
      const response = await request(app).delete(`/teams/${teamId}`).expect(500)
      expect(response.body.error).toBe(true)
      expect(response.body.message).toBe('DB error')
      s.restore()
    })
  })

  describe('GET /teams to handle the errors', () => {
    afterEach(() => sinon.restore())

    it('call the error when the find method does not work', async () => {
      const fake = { populate: sinon.stub().returnsThis(), sort: sinon.stub().rejects(new Error('DB error')) }
      const s = sinon.stub(Team, 'find').returns(fake)
      const response = await request(app).get('/teams').expect(500)
      expect(response.body.error).toBe(true)
      expect(response.body.message).toBe('DB error')
      s.restore()
    })
  })
})
