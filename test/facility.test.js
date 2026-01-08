import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Facility from '../src/models/Facility.js'

describe('Facility CRUD Operations', () => {
  let facilityId

  beforeEach(async () => {
    await Facility.deleteMany({})
  })

  // ========== CREATE ==========
  describe('POST /facilities', () => {
    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/facilities')
        .send({ location: 'Paris', capacity: 500 })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create facility with valid data', async () => {
      const response = await request(app)
        .post('/facilities')
        .send({
          name: 'Stadium Central',
          location: 'Paris',
          capacity: 800,
          type: 'outdoor'
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Stadium Central')
      expect(response.body.data.capacity).toBe(800)
      facilityId = response.body.data._id
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /facilities', () => {
    beforeEach(async () => {
      await Facility.create([
        { name: 'Stadium A', location: 'Paris', capacity: 500, type: 'outdoor' },
        { name: 'Stadium B', location: 'Lyon', capacity: 600, type: 'outdoor' }
      ])
    })

    it('should return all facilities', async () => {
      const response = await request(app)
        .get('/facilities')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /facilities/:id', () => {
    beforeEach(async () => {
      const facility = await Facility.create({
        name: 'Stadium Test',
        location: 'Marseille',
        capacity: 700,
        type: 'outdoor'
      })
      facilityId = facility._id.toString()
    })

    it('should return 404 if facility not found', async () => {
      const response = await request(app)
        .get('/facilities/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return facility by id', async () => {
      const response = await request(app)
        .get(`/facilities/${facilityId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(facilityId)
      expect(response.body.data.name).toBe('Stadium Test')
    })
  })

  // ========== UPDATE ==========
  describe('PUT /facilities/:id', () => {
    beforeEach(async () => {
      const facility = await Facility.create({
        name: 'Stadium Old',
        location: 'Toulouse',
        capacity: 400,
        type: 'outdoor'
      })
      facilityId = facility._id.toString()
    })

    it('should return 404 if facility not found', async () => {
      const response = await request(app)
        .put('/facilities/507f1f77bcf86cd799439011')
        .send({ name: 'Updated' })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should update facility successfully', async () => {
      const response = await request(app)
        .put(`/facilities/${facilityId}`)
        .send({
          name: 'Stadium New',
          capacity: 900
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Stadium New')
      expect(response.body.data.capacity).toBe(900)
    })
  })

  // ========== DELETE ==========
  describe('DELETE /facilities/:id', () => {
    beforeEach(async () => {
      const facility = await Facility.create({
        name: 'Stadium Delete',
        location: 'Nice',
        capacity: 500,
        type: 'outdoor'
      })
      facilityId = facility._id.toString()
    })

    it('should return 404 if facility not found', async () => {
      const response = await request(app)
        .delete('/facilities/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should delete facility successfully', async () => {
      const response = await request(app)
        .delete(`/facilities/${facilityId}`)
        .expect(200)

      expect(response.body.success).toBe(true)

      // Vérifier que c'est bien supprimé
      const checkResponse = await request(app)
        .get(`/facilities/${facilityId}`)
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
describe('Facility routes to handle the errors', () => {
  it('return an error when GET /facilities is thrown', async () => {
    vi.spyOn(Facility, 'find').mockReturnValue({
      sort: vi.fn().mockRejectedValue(new Error('DB failure'))
    })
    const response = await request(app).get('/facilities').expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('DB failure')
    vi.restoreAllMocks()
  })

  it('return an error when GET /facilities/:id is thrown', async () => {
    vi.spyOn(Facility, 'findById').mockRejectedValueOnce(new Error('Find failed'))
    const response = await request(app).get('/facilities/507f1f77bcf86cd799439011').expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Find failed')
    vi.restoreAllMocks()
  })

  it('return an error when PUT /facilities/:id is thrown', async () => {
    vi.spyOn(Facility, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Update failed'))
    const response = await request(app).put('/facilities/507f1f77bcf86cd799439011').send({ name: 'Facility updated' }).expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Update failed')
    vi.restoreAllMocks()
  })

  it('return an error when POST /facilities is thrown', async () => {
    vi.spyOn(Facility.prototype, 'save').mockRejectedValueOnce(new Error('Save failed'))
    const response = await request(app)
      .post('/facilities')
      .send({ name: 'facility17', location: 'Nice', capacity: 400 })
      .expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Save failed')
    vi.restoreAllMocks()
  })

  it('return an error when DELETE /facilities/:id is thrown', async () => {
    vi.spyOn(Facility, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Delete failed'))
    const response = await request(app).delete('/facilities/507f1f77bcf86cd799439011').expect(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Delete failed')
    vi.restoreAllMocks()
  })
})
