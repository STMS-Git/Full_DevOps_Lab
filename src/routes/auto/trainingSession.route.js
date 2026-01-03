import express from 'express'
import TrainingSession from '../../models/TrainingSession.js'

const router = express.Router()

// GET /trainingSessions - Récupérer tous les entraînements
router.get('/', async (req, res, next) => {
  try {
    const trainings = await TrainingSession.find()
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')
      .sort({ eventDate: 1 })

    res.json({
      success: true,
      count: trainings.length,
      data: trainings
    })
  } catch (error) {
    next(error)
  }
})

// GET /trainingSessions/:id - Récupérer un entraînement par ID
router.get('/:id', async (req, res, next) => {
  try {
    const training = await TrainingSession.findById(req.params.id)
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training session not found'
      })
    }

    res.json({
      success: true,
      data: training
    })
  } catch (error) {
    next(error)
  }
})

// POST /trainingSessions - Créer un nouvel entraînement
router.post('/', async (req, res, next) => {
  try {
    const {
      eventDate,
      eventSlot,
      duration,
      trainingLevel = 'intermediate',
      trainingType = 'mixed',
      facilityId,
      coachId,
      teamId,
      maxParticipants = 25,
      description,
      isMandatory = false
    } = req.body

    // Validation basique
    if (!eventDate || !eventSlot || !duration || !facilityId || !coachId || !teamId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Créer le nouvel entraînement
    const training = new TrainingSession({
      eventDate,
      eventSlot,
      duration,
      trainingLevel,
      trainingType,
      facilityId,
      coachId,
      teamId,
      maxParticipants,
      description,
      isMandatory,
      eventType: 'training'
    })

    // Sauvegarder dans MongoDB
    await training.save()

    // Remplir les références
    await training.populate('facilityId coachId teamId')

    res.status(201).json({
      success: true,
      message: 'Training session created successfully',
      data: training
    })
  } catch (error) {
    next(error)
  }
})

// PUT /trainingSessions/:id - Mettre à jour un entraînement
router.put('/:id', async (req, res, next) => {
  try {
    const {
      eventDate,
      eventSlot,
      duration,
      trainingLevel,
      trainingType,
      maxParticipants,
      description,
      isMandatory
    } = req.body

    const training = await TrainingSession.findByIdAndUpdate(
      req.params.id,
      {
        eventDate,
        eventSlot,
        duration,
        trainingLevel,
        trainingType,
        maxParticipants,
        description,
        isMandatory
      },
      { new: true, runValidators: true }
    )
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training session not found'
      })
    }

    res.json({
      success: true,
      message: 'Training session updated successfully',
      data: training
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /trainingSessions/:id - Supprimer un entraînement
router.delete('/:id', async (req, res, next) => {
  try {
    const training = await TrainingSession.findByIdAndDelete(req.params.id)

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training session not found'
      })
    }

    res.json({
      success: true,
      message: 'Training session deleted successfully',
      data: training
    })
  } catch (error) {
    next(error)
  }
})

export default router
