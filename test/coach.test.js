import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'
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
        .send({ lastName: 'Dupont', email: 'jean@example.com', phoneNumber: '0695788179' })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create coach with valid data', async () => {
      const response = await request(app)
        .post('/coaches')
        .send({
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
          phoneNumber: '0625788179'
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
        { firstName: 'Marie', lastName: 'Martin', email: 'marie@example.com', phoneNumber: '0696788179' },
        { firstName: 'Pierre', lastName: 'Pierre', email: 'pierre@example.com', phoneNumber: '0695788279' }
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
        email: 'luc@example.com',
        phoneNumber: '0695788179'
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
        email: 'jeanold@example.com',
        phoneNumber: '0695788179'
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
        email: 'anna@example.com',
        phoneNumber: '0695788179'
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

/**
 * ==============
 * Error handling
 * ==============
 */
describe('Coach routes to handle the errors', () => {
  it('return an error when GET /coaches is thrown', async () => {
    vi.spyOn(Coach, 'find').mockReturnValue({
      sort: vi.fn().mockRejectedValue(new Error('DB failure'))
    })
    const response = await request(app).get('/coaches').expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('DB failure')
    vi.restoreAllMocks()
  })

  it('return an error when GET /coaches/:id is thrown', async () => {
    vi.spyOn(Coach, 'findById').mockRejectedValueOnce(new Error('DB failure'))
    const response = await request(app).get('/coaches/507f1f77bcf86cd799439011').expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('DB failure')
    vi.restoreAllMocks()
  })

  it('return an error when PUT /coaches/:id is thrown', async () => {
    vi.spyOn(Coach, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Update failed'))
    const response = await request(app).put('/coaches/507f1f77bcf86cd799439011').send({ firstName: 'Test' }).expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Update failed')
    vi.restoreAllMocks()
  })

  it('return an error when POST /coaches is thrown', async () => {
    const spy = vi.spyOn(Coach.prototype, 'save').mockRejectedValueOnce(new Error('Save failed'))
    const response = await request(app)
      .post('/coaches')
      .send({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@gmail.com',
        phoneNumber: '0625784171'
      })
      .expect(500)

    expect(response.body.error).toBe(true)
    spy.mockRestore()
  })

  it('return an error when DELETE /coaches/:id is thrown', async () => {
    vi.spyOn(Coach, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Delete failed'))
    const response = await request(app).delete('/coaches/507f1f77bcf86cd799439011').expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Delete failed')
    vi.restoreAllMocks()
  })
})
