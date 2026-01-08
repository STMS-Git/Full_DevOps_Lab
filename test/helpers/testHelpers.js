/**
 * Test helpers for integration tests
 * Provides reusable functions to reduce duplication
 */
import mongoose from 'mongoose'
import Team from '../../src/models/Team.js'
import Coach from '../../src/models/Coach.js'
import Facility from '../../src/models/Facility.js'
import MatchSession from '../../src/models/MatchSession.js'
import TrainingSession from '../../src/models/TrainingSession.js'

/**
 * Clear all collections in the test database
 */
export async function clearDatabase () {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

/**
 * Clear a specific model's collection
 * @param {mongoose.Model} Model - Mongoose model to clear
 */
export async function clearCollection (Model) {
  await Model.deleteMany({})
}

/**
 * Create a team in the database
 * @param {Object} data - Team data (partial)
 * @returns {Promise<Object>} Created team
 */
export async function createTeam (data = {}) {
  const team = new Team({
    name: data.name || 'Test Team',
    sport: data.sport || 'Football',
    ageCategory: data.ageCategory || 'U15',
    level: data.level || 'Régional',
    ...data
  })
  return await team.save()
}

/**
 * Create a coach in the database
 * @param {Object} data - Coach data (partial)
 * @returns {Promise<Object>} Created coach
 */
export async function createCoach (data = {}) {
  const coach = new Coach({
    firstName: data.firstName || 'John',
    lastName: data.lastName || 'Doe',
    email: data.email || 'john.doe@test.com',
    phone: data.phone || '0123456789',
    ...data
  })
  return await coach.save()
}

/**
 * Create a facility in the database
 * @param {Object} data - Facility data (partial)
 * @returns {Promise<Object>} Created facility
 */
export async function createFacility (data = {}) {
  const facility = new Facility({
    name: data.name || 'Test Facility',
    address: data.address || '123 Test St',
    capacity: data.capacity || 100,
    ...data
  })
  return await facility.save()
}

/**
 * Create a match session in the database
 * @param {Object} data - Match session data (partial)
 * @returns {Promise<Object>} Created match session
 */
export async function createMatchSession (data = {}) {
  // Ensure required references exist
  if (!data.team) {
    const team = await createTeam()
    data.team = team._id
  }
  if (!data.facility) {
    const facility = await createFacility()
    data.facility = facility._id
  }

  const matchSession = new MatchSession({
    date: data.date || new Date(),
    opponent: data.opponent || 'Test Opponent',
    type: data.type || 'home',
    ...data
  })
  return await matchSession.save()
}

/**
 * Create a training session in the database
 * @param {Object} data - Training session data (partial)
 * @returns {Promise<Object>} Created training session
 */
export async function createTrainingSession (data = {}) {
  // Ensure required references exist
  if (!data.team) {
    const team = await createTeam()
    data.team = team._id
  }
  if (!data.facility) {
    const facility = await createFacility()
    data.facility = facility._id
  }

  const trainingSession = new TrainingSession({
    date: data.date || new Date(),
    duration: data.duration || 90,
    objectives: data.objectives || ['Test objective'],
    ...data
  })
  return await trainingSession.save()
}

/**
 * Assert that a response has a standard error shape
 * @param {Object} body - Response body
 * @param {number} expectedStatus - Expected HTTP status
 */
export function assertErrorResponse (body, expectedStatus) {
  return {
    error: true,
    status: expectedStatus,
    ...body
  }
}

/**
 * Generate a valid MongoDB ObjectId string
 * @returns {string} Valid ObjectId
 */
export function generateObjectId () {
  return new mongoose.Types.ObjectId().toString()
}

/**
 * Generate an invalid MongoDB ObjectId string
 * @returns {string} Invalid ObjectId
 */
export function generateInvalidObjectId () {
  return 'invalid-id-123'
}
