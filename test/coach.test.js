import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach } from 'vitest'
import Coach from '../src/models/Coach.js'

describe('Coach CRUD Operations', () => {
  let coachId

  beforeEach(async () => {
    await Coach.deleteMany({})
  })

  // ========== CREATE ==========
  describe('POST /coaches', () => {
    it('should return 400 if firstName is missing', async () => {
      const response = await request(app)
        .post('/coaches')
        .send({ lastName: 'Dupont', email: 'jean@example.com' })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create coach with valid data', async () => {
      const response = await request(app)
        .post('/coaches')
        .send({
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com'
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.firstName).toBe('Jean')
      expect(response.body.data.email).toBe('jean@example.com')
      coachId = response.body.data._id
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /coaches', () => {
    beforeEach(async () => {
      await Coach.create([
        { firstName: 'Marie', lastName: 'Martin', email: 'marie@example.com' },
        { firstName: 'Pierre', lastName: 'Pierre', email: 'pierre@example.com' }
      ])
    })

    it('should return all coaches', async () => {
      const response = await request(app)
        .get('/coaches')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /coaches/:id', () => {
    beforeEach(async () => {
      const coach = await Coach.create({
        firstName: 'Luc',
        lastName: 'Bernard',
        email: 'luc@example.com'
      })
      coachId = coach._id.toString()
    })

    it('should return 404 if coach not found', async () => {
      const response = await request(app)
        .get('/coaches/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return coach by id', async () => {
      const response = await request(app)
        .get(`/coaches/${coachId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(coachId)
      expect(response.body.data.firstName).toBe('Luc')
    })
  })

  // ========== UPDATE ==========
  describe('PUT /coaches/:id', () => {
    beforeEach(async () => {
      const coach = await Coach.create({
        firstName: 'Jean',
        lastName: 'Old',
        email: 'jeanold@example.com'
      })
      coachId = coach._id.toString()
    })

    it('should return 404 if coach not found', async () => {
      const response = await request(app)
        .put('/coaches/507f1f77bcf86cd799439011')
        .send({ firstName: 'Updated' })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should update coach successfully', async () => {
      const response = await request(app)
        .put(`/coaches/${coachId}`)
        .send({
          firstName: 'Jacques',
          lastName: 'New'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.firstName).toBe('Jacques')
      expect(response.body.data.lastName).toBe('New')
    })
  })

  // ========== DELETE ==========
  describe('DELETE /coaches/:id', () => {
    beforeEach(async () => {
      const coach = await Coach.create({
        firstName: 'Anna',
        lastName: 'Delete',
        email: 'anna@example.com'
      })
      coachId = coach._id.toString()
    })

    it('should return 404 if coach not found', async () => {
      const response = await request(app)
        .delete('/coaches/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should delete coach successfully', async () => {
      const response = await request(app)
        .delete(`/coaches/${coachId}`)
        .expect(200)

      expect(response.body.success).toBe(true)

      const checkResponse = await request(app)
        .get(`/coaches/${coachId}`)
        .expect(404)

      expect(checkResponse.body.success).toBe(false)
    })
  })
})
