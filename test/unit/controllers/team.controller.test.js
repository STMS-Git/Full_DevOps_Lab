import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../../../src/controllers/team.controller.js'
import Team from '../../../src/models/Team.js'

vi.mock('../../../src/models/Team.js')

describe('Team Controller - Unit Tests', () => {
  let req, res, next

  beforeEach(() => {
    vi.clearAllMocks()
    req = { body: {}, params: {} }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()
  })

  describe('listTeams', () => {
    it('should return all teams with populated coachId', async () => {
      const mockTeams = [
        { _id: '1', name: 'Team A', coachId: { firstName: 'John' } },
        { _id: '2', name: 'Team B', coachId: { firstName: 'Jane' } }
      ]

      Team.find = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockResolvedValue(mockTeams)
        })
      })

      await listTeams(req, res, next)

      expect(Team.find).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockTeams
      })
    })

    it('should call next with error if find fails', async () => {
      const error = new Error('Database error')
      Team.find = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockRejectedValue(error)
        })
      })

      await listTeams(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getTeamById', () => {
    it('should return a team by id with populated coachId', async () => {
      const mockTeam = { _id: '123', name: 'Team A', coachId: { firstName: 'John' } }
      req.params.id = '123'

      Team.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockTeam)
      })

      await getTeamById(req, res, next)

      expect(Team.findById).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTeam
      })
    })

    it('should return 404 if team not found', async () => {
      req.params.id = '999'
      Team.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(null)
      })

      await getTeamById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Team not found'
      })
    })

    it('should call next with error if findById fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Team.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockRejectedValue(error)
      })

      await getTeamById(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createTeam', () => {
    it('should create a team successfully', async () => {
      const teamData = { name: 'New Team', coachId: '789' }
      const savedTeam = { _id: '456', ...teamData }

      req.body = teamData
      // ✅ CORRECTION : Fonctions classiques
      const mockPopulate = vi.fn(function () {
        return Promise.resolve(savedTeam)
      })

      const mockSave = vi.fn(function () {
        return Promise.resolve({ ...savedTeam, populate: mockPopulate })
      })

      const mockTeam = {
        ...teamData,
        save: mockSave,
        populate: mockPopulate
      }

      Team.mockImplementation(function () {
        return mockTeam
      })

      await createTeam(req, res, next)

      expect(mockTeam.save).toHaveBeenCalled()
      expect(mockTeam.populate).toHaveBeenCalledWith('coachId')
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: savedTeam
      })
    })

    it('should call next with error if save fails', async () => {
      const error = new Error('Database error')
      req.body = { name: 'Team Test', coachId: '123' }

      // ✅ CORRECTION : Fonction classique
      const mockSave = vi.fn(function () {
        return Promise.reject(error)
      })

      const mockTeam = { ...req.body, save: mockSave }
      Team.mockImplementation(function () {
        return mockTeam
      })

      await createTeam(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateTeam', () => {
    it('should update a team successfully', async () => {
      req.params.id = '123'
      req.body = {
        name: 'Updated Team',
        sport: 'Basketball'
      }

      const mockTeam = { _id: '123', ...req.body }
      Team.findByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockTeam)
      })

      await updateTeam(req, res, next)

      expect(Team.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        req.body,
        { new: true, runValidators: true }
      )
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Team updated successfully',
        data: mockTeam
      })
    })

    it('should return 404 if team not found', async () => {
      req.params.id = '999'
      req.body = { name: 'Test' }

      Team.findByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(null)
      })

      await updateTeam(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Team not found'
      })
    })

    it('should call next with error if update fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      req.body = { name: 'Test' }

      Team.findByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockRejectedValue(error)
      })

      await updateTeam(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteTeam', () => {
    it('should delete a team successfully', async () => {
      req.params.id = '123'
      const mockTeam = { _id: '123', name: 'Team A' }

      Team.findByIdAndDelete = vi.fn().mockResolvedValue(mockTeam)

      await deleteTeam(req, res, next)

      expect(Team.findByIdAndDelete).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Team deleted successfully',
        data: mockTeam
      })
    })

    it('should return 404 if team not found', async () => {
      req.params.id = '999'
      Team.findByIdAndDelete = vi.fn().mockResolvedValue(null)

      await deleteTeam(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Team not found'
      })
    })

    it('should call next with error if delete fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'

      Team.findByIdAndDelete = vi.fn().mockRejectedValue(error)

      await deleteTeam(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
