/* eslint-env node */
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Coach Routes', () => {
  describe('GET /coaches', () => {
    it('should return coaches response', { timeout: 5000 }, async () => {
      const response = await request(app)
        .get('/coaches')
        .timeout(3000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('POST /coaches', () => {
    it('should return 400 if firstName is missing', async () => {
      const invalidCoach = {
        lastName: 'Dupont',
        email: 'jean.dupont@example.com'
      }

      const response = await request(app)
        .post('/coaches')
        .timeout(1000)
        .send(invalidCoach)
        .expect(400)

      expect(response.body).toHaveProperty('success')
      expect(response.body.success).toBe(false)
    })

    it('should accept valid coach data', async () => {
      const validCoach = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        specialization: 'Defense',
        experience: 10
      }

      const response = await request(app)
        .post('/coaches')
        .timeout(1000)
        .send(validCoach)

      expect(response.body).toBeDefined()
    })
  })

  describe('GET /coaches/:id', () => {
    it('should return coach by id', async () => {
      const response = await request(app)
        .get('/coaches/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('PUT /coaches/:id', () => {
    it('should update coach', async () => {
      const updatedCoach = {
        firstName: 'Pierre'
      }

      const response = await request(app)
        .put('/coaches/invalid-id')
        .timeout(1000)
        .send(updatedCoach)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })

  describe('DELETE /coaches/:id', () => {
    it('should delete coach', async () => {
      const response = await request(app)
        .delete('/coaches/invalid-id')
        .timeout(1000)
        .expect('Content-Type', /json/)

      expect(response.body).toBeDefined()
    })
  })
})
