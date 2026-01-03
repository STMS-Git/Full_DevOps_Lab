import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach } from 'vitest'
import Team from '../src/models/Team.js'

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
  })
})
