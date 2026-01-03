import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { beforeAll, afterAll } from 'vitest'

let mongoServer

// Setup avant tous les tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
  console.log('✅ MongoDB Memory Server started')
})

// Cleanup après tous les tests
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
  console.log('✅ MongoDB Memory Server stopped')
})
