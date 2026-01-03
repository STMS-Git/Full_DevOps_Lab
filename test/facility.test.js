/* eslint-env node */
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import Facility from '../src/models/Facility.js'

describe('Facility Routes - Full CRUD', () => {
  let facilityId

  beforeEach(async () => {
    // Nettoyer avant chaque test
    await Facility.deleteMany({})
  })

  describe('POST /facilities', () => {
    it('should return 400 if name is missing', async () => {
      const invalidFacility = {
        location: 'Paris',
        capacity: 5000
      }

      const response = await request(app)
        .post('/facilities')
        .send(invalidFacility)
        .expect(400)

      expect(response.body).toHaveProperty('success')
      expect(response.body.success).toBe(false)
    })

    it('should create facility with valid data', async () => {
      const validFacility = {
        name: 'Stadium Central',
        location: 'Paris',
        capacity: 5000,
        type: 'outdoor'
      }

      const response = await request(app)
        .post('/facilities')
        .send(validFacility)
        .expect(201)

      expect(response.body).toHaveProperty('_id')
      expect(response.body.name).toBe('Stadium Central')
      
      facilityId = response.body._id

      // Vérifier que c'est vraiment en BD
      const facility = await Facility.findById(facilityId)
      expect(facility).toBeDefined()
      expect(facility.capacity).toBe(5000)
    })
  })

  describe('GET /facilities/:id', () => {
    it('should return facility by id', async () => {
      // Créer une facility d'abord
      const facility = await Facility.create({
        name: 'Test Stadium',
        location: 'Lyon',
        capacity: 3000,
        type: 'indoor'
      })

      const response = await request(app)
        .get(`/facilities/${facility._id}`)
        .expect(200)

      expect(response.body.name).toBe('Test Stadium')
      expect(response.body.location).toBe('Lyon')
    })

    it('should return 404 for invalid id', async () => {
      const response = await request(app)
        .get('/facilities/invalid-id')
        .expect(404)

      expect(response.body).toBeDefined()
    })
  })

  describe('PUT /facilities/:id', () => {
    it('should update facility', async () => {
      const facility = await Facility.create({
        name: 'Old Name',
        location: 'Paris',
        capacity: 2000,
        type: 'outdoor'
      })

      const response = await request(app)
        .put(`/facilities/${facility._id}`)
        .send({ name: 'Updated Stadium', capacity: 5000 })
        .expect(200)

      expect(response.body.name).toBe('Updated Stadium')
      expect(response.body.capacity).toBe(5000)

      // Vérifier en BD
      const updated = await Facility.findById(facility._id)
      expect(updated.name).toBe('Updated Stadium')
    })
  })

  describe('DELETE /facilities/:id', () => {
    it('should delete facility', async () => {
      const facility = await Facility.create({
        name: 'To Delete',
        location: 'Paris',
        capacity: 1000,
        type: 'outdoor'
      })

      await request(app)
        .delete(`/facilities/${facility._id}`)
        .expect(200)

      // Vérifier que c'est vraiment supprimé
      const deleted = await Facility.findById(facility._id)
      expect(deleted).toBeNull()
    })
  })

  describe('GET /facilities', () => {
    it('should return all facilities', async () => {
      await Facility.create({
        name: 'Stadium 1',
        location: 'Paris',
        capacity: 5000,
        type: 'outdoor'
      })
      await Facility.create({
        name: 'Stadium 2',
        location: 'Lyon',
        capacity: 3000,
        type: 'indoor'
      })

      const response = await request(app)
        .get('/facilities')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(2)
    })
  })
})
