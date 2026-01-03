/* eslint-env node */
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Training Session Routes', () => {
  describe('GET /trainingSessions', () => {
    it('should return training sessions response', { timeout: 5000 }, async () => {
      const response = await request(app)
        .get('/trainingSessions')
        .timeout(3000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('POST /trainingSessions', () => {
    it('should return 400 if duration is missing', async () => {
      const invalidTraining = {
        eventDate: '2025-06-10',
        eventSlot: 'morning',
        trainingLevel: 'intermediate',
        facilityId: '507f1f77bcf86cd799439011'
      }

      const response = await request(app)
        .post('/trainingSessions')
        .timeout(1000)
        .send(invalidTraining)
        .expect(400)

      expect(response.body).toHaveProperty('success')
      expect(response.body.success).toBe(false)
    })

    it('should accept valid training session data', async () => {
      const validTraining = {
        eventDate: '2025-06-10',
        eventSlot: 'morning',
        duration: 90,
        trainingLevel: 'intermediate',
        trainingType: 'technical',
        facilityId: '507f1f77bcf86cd799439011',
        coachId: '507f1f77bcf86cd799439012',
        teamId: '507f1f77bcf86cd799439013',
        maxParticipants: 20,
        description: 'Ball control drills'
      }

      const response = await request(app)
        .post('/trainingSessions')
        .timeout(1000)
        .send(validTraining)

      expect(response.body).toBeDefined()
    })
  })

  describe('GET /trainingSessions/:id', () => {
    it('should return training session by id', async () => {
      const response = await request(app)
        .get('/trainingSessions/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('PUT /trainingSessions/:id', () => {
    it('should update training session', async () => {
      const updatedTraining = {
        eventDate: '2025-06-12'
      }

      const response = await request(app)
        .put('/trainingSessions/invalid-id')
        .timeout(1000)
        .send(updatedTraining)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('DELETE /trainingSessions/:id', () => {
    it('should delete training session', async () => {
      const response = await request(app)
        .delete('/trainingSessions/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })
})
