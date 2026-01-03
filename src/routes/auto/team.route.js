import express from 'express'
import Team from '../../models/Team.js'

const router = express.Router()

// GET /teams - Récupérer toutes les équipes
router.get('/', async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate('coachId')
      .sort({ name: 1 })

    res.json({
      success: true,
      count: teams.length,
      data: teams
    })
  } catch (error) {
    next(error)
  }
})

// GET /teams/:id - Récupérer une équipe par ID
router.get('/:id', async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('coachId')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.json({
      success: true,
      data: team
    })
  } catch (error) {
    next(error)
  }
})

// POST /teams - Créer une nouvelle équipe
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      sport = 'Football',
      city,
      foundedYear,
      coachId,
      isActive = true
    } = req.body

    // Validation basique
    if (!name || !sport) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, sport'
      })
    }

    // Créer la nouvelle équipe
    const team = new Team({
      name,
      sport,
      city,
      foundedYear,
      coachId,
      isActive
    })

    // Sauvegarder dans MongoDB
    await team.save()

    // Remplir la référence coachId
    await team.populate('coachId')

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    })
  } catch (error) {
    next(error)
  }
})

// PUT /teams/:id - Mettre à jour une équipe
router.put('/:id', async (req, res, next) => {
  try {
    const {
      name,
      sport,
      city,
      foundedYear,
      coachId,
      isActive
    } = req.body

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name,
        sport,
        city,
        foundedYear,
        coachId,
        isActive
      },
      { new: true, runValidators: true }
    )
      .populate('coachId')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: team
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /teams/:id - Supprimer une équipe
router.delete('/:id', async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.json({
      success: true,
      message: 'Team deleted successfully',
      data: team
    })
  } catch (error) {
    next(error)
  }
})

export default router
