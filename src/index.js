import 'dotenv/config' // We load .env features
import app from './app.js'
import { connectDB } from './config/database.js'

const PORT = process.env.PORT || 3000

// Async function, so that we can use await
const startServer = async () => {
  try {
    // 1. Connection to MongoDB
    console.log('🔌 Connexion à MongoDB...')
    await connectDB()

    // 2. Run the servor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  ✅ Serveur démarré                    ║
║  📍 Port: ${PORT}                       ║
║  🗄️  Base de données: MongoDB           ║
║  🌐 http://localhost:${PORT}            ║
╚════════════════════════════════════════╝
      `)
    })
  } catch (error) {
    console.error('❌ Erreur au démarrage :', error.message)
    process.exit(1)
  }
}

// Call the function
startServer()
