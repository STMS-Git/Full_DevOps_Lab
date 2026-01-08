/**
 * Test data factories
 * Generates consistent test data across test suites
 */

/**
 * Generate team test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Team data
 */
export function teamFactory (overrides = {}) {
  return {
    name: 'Test Team',
    sport: 'Football',
    ageCategory: 'U15',
    level: 'Régional',
    ...overrides
  }
}

/**
 * Generate coach test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Coach data
 */
export function coachFactory (overrides = {}) {
  const timestamp = Date.now()
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe.${timestamp}@test.com`, // Unique email
    phone: '0123456789',
    certifications: ['Diploma 1', 'Diploma 2'],
    ...overrides
  }
}

/**
 * Generate facility test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Facility data
 */
export function facilityFactory (overrides = {}) {
  return {
    name: 'Test Facility',
    address: '123 Test Street',
    city: 'Test City',
    postalCode: '12345',
    capacity: 100,
    type: 'indoor',
    amenities: ['parking', 'lockers'],
    ...overrides
  }
}

/**
 * Generate match session test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Match session data
 */
export function matchSessionFactory (overrides = {}) {
  return {
    date: new Date().toISOString(),
    opponent: 'Test Opponent',
    type: 'home',
    score: { home: 0, away: 0 },
    ...overrides
  }
}

/**
 * Generate training session test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Training session data
 */
export function trainingSessionFactory (overrides = {}) {
  return {
    date: new Date().toISOString(),
    duration: 90,
    objectives: ['Passing', 'Shooting'],
    exercises: [
      { name: 'Warm-up', duration: 15 },
      { name: 'Drills', duration: 45 },
      { name: 'Scrimmage', duration: 30 }
    ],
    ...overrides
  }
}

/**
 * Generate multiple items using a factory
 * @param {Function} factory - Factory function
 * @param {number} count - Number of items to generate
 * @returns {Array} Array of generated items
 */
export function generateMany (factory, count = 3) {
  return Array.from({ length: count }, (_, i) =>
    factory({ name: `${factory.name.replace('Factory', '')} ${i + 1}` })
  )
}
