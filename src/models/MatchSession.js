import mongoose from 'mongoose'

const matchSessionSchema = new mongoose.Schema(
  {
    // Event type
    eventType: {
      type: String,
      enum: ['match', 'training'], // We only allow those values
      default: 'match',
      required: true
    },

    // Event date
    eventDate: {
      type: Date,
      required: true
    },

    // Slot
    eventSlot: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50
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

    opponentTeamName: { // Opponent team
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    collection: 'matchSessions'
  }
)

const MatchSession = mongoose.model('MatchSession', matchSessionSchema)

export default MatchSession
