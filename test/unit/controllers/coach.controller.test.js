import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach
} from '../../../src/controllers/coach.controller.js'
import Coach from '../../../src/models/coach.model.js'

vi.mock('../../../src/models/coach.model.js')

describe('Coach Controller - Unit Tests', () => {
  let req, res, next

  beforeEach(() => {
    req = { params: {}, body: {} }
    res = {
      json: vi.fn(),
      status: vi.fn(function () { return this })
    }
    next = vi.fn()
    vi.clearAllMocks()
  })

  describe('listCoaches', () => {
    it('should return all coaches sorted by name', async () => {
      const mockCoaches = [
        { _id: '1', name: 'Coach A', specialty: 'Football' },
        { _id: '2', name: 'Coach B', specialty: 'Basketball' }
      ]

      const sortMock = vi.fn().mockResolvedValue(mockCoaches)
      Coach.find = vi.fn().mockReturnValue({ sort: sortMock })

      await listCoaches(req, res, next)

      expect(Coach.find).toHaveBeenCalled()
      expect(sortMock).toHaveBeenCalledWith({ name: 1 })
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCoaches
      })
    })

    it('should call next with error if find fails', async () => {
      const error = new Error('Database error')
      Coach.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockRejectedValue(error)
      })

      await listCoaches(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getCoachById', () => {
    it('should return a coach by id', async () => {
      const mockCoach = { _id: '123', name: 'Coach Test', specialty: 'Football' }
      req.params.id = '123'

      Coach.findById = vi.fn().mockResolvedValue(mockCoach)

      await getCoachById(req, res, next)

      expect(Coach.findById).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCoach
      })
    })

    it('should return 404 if coach not found', async () => {
      req.params.id = '999'
      Coach.findById = vi.fn().mockResolvedValue(null)

      await getCoachById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Coach not found'
      })
    })

    it('should call next with error if findById fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Coach.findById = vi.fn().mockRejectedValue(error)

      await getCoachById(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createCoach', () => {
    it('should create a coach successfully', async () => {
      const coachData = { name: 'New Coach', specialty: 'Tennis' }
      const savedCoach = { _id: '456', ...coachData }

      req.body = coachData

      // ✅ CORRECTION : Utiliser une fonction classique au lieu d'une arrow function
      const mockSave = vi.fn(function () {
        return Promise.resolve(savedCoach)
      })

      const mockCoach = { ...coachData, save: mockSave }
      Coach.mockImplementation(function () {
        return mockCoach
      })

      await createCoach(req, res, next)

      expect(mockCoach.save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: savedCoach
      })
    })

    it('should return 400 if required fields are missing', async () => {
      req.body = { name: 'Coach Without Specialty' }

      await createCoach(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name and specialty are required'
      })
    })

    it('should call next with error if save fails', async () => {
      const error = new Error('Database error')
      req.body = { name: 'Coach Test', specialty: 'Football' }

      // ✅ CORRECTION : Fonction classique pour le mock
      const mockSave = vi.fn(function () {
        return Promise.reject(error)
      })

      const mockCoach = { ...req.body, save: mockSave }
      Coach.mockImplementation(function () {
        return mockCoach
      })

      await createCoach(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateCoach', () => {
    it('should update a coach successfully', async () => {
      const updatedCoach = { _id: '123', name: 'Updated Coach', specialty: 'Golf' }
      req.params.id = '123'
      req.body = { name: 'Updated Coach', specialty: 'Golf' }

      Coach.findByIdAndUpdate = vi.fn().mockResolvedValue(updatedCoach)

      await updateCoach(req, res, next)

      expect(Coach.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        req.body,
        { new: true, runValidators: true }
      )
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedCoach
      })
    })

    it('should return 404 if coach not found', async () => {
      req.params.id = '999'
      req.body = { name: 'Updated Coach' }
      Coach.findByIdAndUpdate = vi.fn().mockResolvedValue(null)

      await updateCoach(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Coach not found'
      })
    })

    it('should call next with error if update fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      req.body = { name: 'Updated Coach' }
      Coach.findByIdAndUpdate = vi.fn().mockRejectedValue(error)

      await updateCoach(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteCoach', () => {
    it('should delete a coach successfully', async () => {
      const deletedCoach = { _id: '123', name: 'Deleted Coach' }
      req.params.id = '123'

      Coach.findByIdAndDelete = vi.fn().mockResolvedValue(deletedCoach)

      await deleteCoach(req, res, next)

      expect(Coach.findByIdAndDelete).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Coach deleted successfully',
        data: deletedCoach
      })
    })

    it('should return 404 if coach not found', async () => {
      req.params.id = '999'
      Coach.findByIdAndDelete = vi.fn().mockResolvedValue(null)

      await deleteCoach(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Coach not found'
      })
    })

    it('should call next with error if delete fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Coach.findByIdAndDelete = vi.fn().mockRejectedValue(error)

      await deleteCoach(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
