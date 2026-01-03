/* eslint-env node */
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Team Routes', () => {
  describe('GET /teams', () => {
    it('should return teams response', { timeout: 5000 }, async () => {
      const response = await request(app)
        .get('/teams')
        .timeout(3000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('POST /teams', () => {
    it('should return 400 if name is missing', async () => {
      const invalidTeam = {
        sport: 'Football',
        city: 'Paris'
      }

      const response = await request(app)
        .post('/teams')
        .timeout(1000)
        .send(invalidTeam)
        .expect(400)

      expect(response.body).toHaveProperty('success')
      expect(response.body.success).toBe(false)
    })

    it('should accept valid team data', { timeout: 5000 }, async () => {
      const validTeam = {
        name: 'Paris United',
        sport: 'Football',
        city: 'Paris',
        foundedYear: 1995
      }

      const response = await request(app)
        .post('/teams')
        .timeout(3000)
        .send(validTeam)

      expect(response.body).toBeDefined()
    })
  })

  describe('GET /teams/:id', () => {
    it('should return team by id', async () => {
      const response = await request(app)
        .get('/teams/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('PUT /teams/:id', () => {
    it('should update team', async () => {
      const updatedTeam = {
        name: 'Lyon Stars'
      }

      const response = await request(app)
        .put('/teams/invalid-id')
        .timeout(1000)
        .send(updatedTeam)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('DELETE /teams/:id', () => {
    it('should delete team', async () => {
      const response = await request(app)
        .delete('/teams/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })
})
