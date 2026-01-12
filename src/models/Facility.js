import mongoose from 'mongoose'

// We define the structure of the Facility document
const facilitySchema = new mongoose.Schema(
  {
    // Field 1: name
    name: {
      type: String,
      required: true,
      unique: true, // To avoid two facilities having the same name
      trim: true, // Delete the spaces before/after
      minlength: 3, // At least 3 characters
      maxlength: 100 // At maximum 100 characters
    },

    // Field 2: location
    location: {
      type: String,
      maxlength: 255,
      default: 'Not specified' // Default value
    },

    // Field 3: capacity
    capacity: {
      type: Number,
      min: 1, // At least 1
      max: 1000, // At maximum 1000
      default: 50 // Default value
    },

    // Field 4: type (indoor/outdoor)
    type: {
      type: String,
      enum: ['indoor', 'outdoor', 'hybrid'], // We only allow those values
      default: 'indoor'
    },

    // Field 5: createdAt
    createdAt: {
      type: Date,
      default: Date.now, // Current date (now)
      immutable: true // To indicate that it cannot be changed
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    collection: 'facilities' // MongoDB's collection name
  }
)

// We create the model (the class to interact with MongoDB)
const Facility = mongoose.model('Facility', facilitySchema)

export default Facility
