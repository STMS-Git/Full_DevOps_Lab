import mongoose from 'mongoose'

const trainingSessionSchema = new mongoose.Schema(
  {
    // Event type
    eventType: {
      type: String,
      enum: ['training'],
      default: 'training',
      required: true
    },

    // Event date
    eventDate: {
      type: Date,
      required: true
    },

    // Slot (e.g. "14h00-15h30")
    eventSlot: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50
    },

    // Duration (in minutes)
    duration: {
      type: Number,
      min: 30, // At least 30 minutes
      max: 240, // At maximum 4 hours
      required: true
    },

    // Event's level
    trainingLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },

    // Training type
    trainingType: {
      type: String,
      enum: ['technical', 'tactical', 'physical', 'mixed'],
      default: 'mixed'
    },

    // Foreign key related to Facility
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true
    },

    // Foreign key related to Coach
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
      required: true
    },

    // Foreign key related to Team
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },

    // Maximum number of participants
    maxParticipants: {
      type: Number,
      min: 1,
      max: 100,
      default: 25
    },

    // Event's description
    description: {
      type: String,
      maxlength: 500
    },

    // Mandatory or optional
    isMandatory: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'trainingSessions'
  }
)

const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema)

export default TrainingSession
