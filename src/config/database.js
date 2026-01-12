import mongoose from 'mongoose'

// Function to connect itself to MongoDB
export const connectDB = async () => {
  try {
    // Get the URL connection from .env
    const mongoURI = process.env.MONGODB_URI

    // Connection to MongoDB
    await mongoose.connect(mongoURI)

    // Display a message if it was a success
    console.log('✅ MongoDB connecté avec succès !')
    console.log(`📍 Base de données : ${mongoose.connection.name}`)
  } catch (error) {
    // Display the error in case of failure
    console.error('❌ Erreur de connexion à MongoDB :', error.message)
    // Stop the program in case of failure
    process.exit(1)
  }
}

// Function to log out
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB déconnecté')
  } catch (error) {
    console.error('❌ Erreur de déconnexion :', error.message)
  }
}
