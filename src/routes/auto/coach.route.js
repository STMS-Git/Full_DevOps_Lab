import express from 'express'
import Coach from '../../models/Coach.js'

const router = express.Router()

// GET /coaches - Récupérer tous les coaches
router.get('/', async (req, res, next) => {
  try {
    const coaches = await Coach.find().sort({ lastName: 1, firstName: 1 })

    res.json({
      success: true,
      count: coaches.length,
      data: coaches
    })
  } catch (error) {
    next(error)
  }
})

// GET /coaches/:id - Récupérer un coach par ID
router.get('/:id', async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id)

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      })
    }

    res.json({
      success: true,
      data: coach
    })
  } catch (error) {
    next(error)
  }
})

// POST /coaches - Créer un nouveau coach
router.post('/', async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      specialization = 'Football',
      experience = 0,
      isActive = true
    } = req.body

    // Validation basique
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, email'
      })
    }

    // Créer le nouveau coach
    const coach = new Coach({
      firstName,
      lastName,
      email,
      specialization,
      experience,
      isActive
    })

    // Sauvegarder dans MongoDB
    await coach.save()

    res.status(201).json({
      success: true,
      message: 'Coach created successfully',
      data: coach
    })
  } catch (error) {
    next(error)
  }
})

// PUT /coaches/:id - Mettre à jour un coach
router.put('/:id', async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      specialization,
      experience,
      isActive
    } = req.body

    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        specialization,
        experience,
        isActive
      },
      { new: true, runValidators: true }
    )

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      })
    }

    res.json({
      success: true,
      message: 'Coach updated successfully',
      data: coach
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /coaches/:id - Supprimer un coach
router.delete('/:id', async (req, res, next) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id)

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      })
    }

    res.json({
      success: true,
      message: 'Coach deleted successfully',
      data: coach
    })
  } catch (error) {
    next(error)
  }
})

export default router
