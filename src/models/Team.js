import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    sport: {
      type: String,
      enum: ['Football', 'Rugby', 'Basketball', 'Volleyball', 'Tennis'],
      required: true,
      default: 'Football'
    },

    city: {
      type: String,
      maxlength: 100,
      default: 'Unknown'
    },

    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },

    // Foreign key to Coach
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
      required: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'teams'
  }
)

const Team = mongoose.model('Team', teamSchema)

export default Team
