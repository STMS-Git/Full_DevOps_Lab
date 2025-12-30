/* eslint-env node, jest */
import { request } from 'supertest'
import app from '../src/app.js'

describe('SCRUM-4-schedule-training-session', () => {
  it('returns the free facilities', async () => {
    const response = await request(app).get('/trainings/available-facilities')
      .query({ date_event: '2024-09-02', slot_event: '18:00-20:00' })
      .set('Authorization', 'Bearer coach-token')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.facilities)).toBe(true)
  })
})
