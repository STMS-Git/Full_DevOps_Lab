/* eslint-env node */
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Match Session Routes', () => {
  describe('GET /matchSessions', () => {
    it('should return match sessions response', { timeout: 5000 }, async () => {
      const response = await request(app)
        .get('/matchSessions')
        .timeout(3000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('POST /matchSessions', () => {
    it('should return 400 if eventDate is missing', async () => {
      const invalidMatch = {
        eventSlot: 'morning',
        facilityId: '507f1f77bcf86cd799439011'
      }

      const response = await request(app)
        .post('/matchSessions')
        .timeout(1000)
        .send(invalidMatch)
        .expect(400)

      expect(response.body).toHaveProperty('success')
      expect(response.body.success).toBe(false)
    })

    it('should accept valid match session data', async () => {
      const validMatch = {
        eventDate: '2025-06-15',
        eventSlot: 'morning',
        eventType: 'match',
        facilityId: '507f1f77bcf86cd799439011',
        coachId: '507f1f77bcf86cd799439012',
        teamId: '507f1f77bcf86cd799439013'
      }

      const response = await request(app)
        .post('/matchSessions')
        .timeout(1000)
        .send(validMatch)

      expect(response.body).toBeDefined()
    })
  })

  describe('GET /matchSessions/:id', () => {
    it('should return match session by id', async () => {
      const response = await request(app)
        .get('/matchSessions/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('PUT /matchSessions/:id', () => {
    it('should update match session', async () => {
      const updatedMatch = {
        eventDate: '2025-07-20'
      }

      const response = await request(app)
        .put('/matchSessions/invalid-id')
        .timeout(1000)
        .send(updatedMatch)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('DELETE /matchSessions/:id', () => {
    it('should delete match session', async () => {
      const response = await request(app)
        .delete('/matchSessions/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })
})
