/* eslint-env node */
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('SCRUM-17-schedule-match-session', () => {
  it('returns the free facilities', async () => {
    const response = await request(app).get('/matches/available-facilities')
      .query({ date_event: '2024-09-02', slot_event: '18:00-20:00' })
      .set('Authorization', 'Bearer coach-token')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.facilities)).toBe(true)
  })

  it('schedule a match event (when every input is valid)', async () => {
    const response = await request(app).post('/matches')
      .set('Authorization', 'Bearer coach-token')
      .send({ date_event: '2024-08-03', slot_event: '18:00-20:00', facilityID: 1, teamID: 1 })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.type_event).toBe('match')
    expect(response.body.facilityID_event).toBe(1)
    expect(response.body.teamID_event).toBe(1)
  })

  it('returns 403 if the user is a player (and not a coach)', async () => {
    const response = await request(app).get('/matches/available-facilities')
      .query({ date_event: '2024-09-02', slot_event: '18:00-20:00' })
      .set('Authorization', 'Bearer player-token')

    expect(response.status).toBe(403)
  })

  it('returns 403 if a player (and not a coach) tries to schedule an event', async () => {
    const response = await request(app).post('/matches')
      .set('Authorization', 'Bearer player-token')
      .send({ date_event: '2012-08-07', slot_event: '10:00-12:00', facilityID: 9, teamID: 1 })

    expect(response.status).toBe(403)
  })

  it('returns 400 if no teamID has been indicated', async () => {
    const response = await request(app).post('/matches')
      .set('Authorization', 'Bearer coach-token')
      .send({ date_event: '2023-02-02', slot_event: '09:00-10:00', facilityID: 1 })

    expect(response.status).toBe(400)
    expect(response.body.message).toBeDefined()
  })

  it('returns 400 if no slot has been indicated', async () => {
    const response = await request(app).get('/matches/available-facilities')
      .query({ date_event: '2024-09-02' })
      .set('Authorization', 'Bearer coach-token')

    expect(response.status).toBe(400)
    expect(response.body.message).toBeDefined()
  })

  it('returns 400 if no date has been indicated', async () => {
    const response = await request(app).get('/matches/available-facilities')
      .query({ slot_event: '19:00-20:00' })
      .set('Authorization', 'Bearer coach-token')

    expect(response.status).toBe(400)
    expect(response.body.message).toBeDefined()
  })

  it('returns 400 if no facility has been indicated', async () => {
    const response = await request(app).post('/matches')
      .set('Authorization', 'Bearer coach-token')
      .send({ date_event: '2024-12-12' })

    expect(response.status).toBe(400)
    expect(response.body.message).toBeDefined()
  })

  it('returns 400 if the facility has already been reserved', async () => {
    await request(app).post('/matches')
      .set('Authorization', 'Bearer coach-token')
      .send({ date_event: '2024-12-11', slot_event: '18:00-20:00', facilityID: 1, teamID: 1 })

    const response = await request(app).post('/matches')
      .set('Authorization', 'Bearer coach-token')
      .send({ date_event: '2024-12-11', slot_event: '18:00-20:00', facilityID: 1, teamID: 3 })
    expect(response.status).toBe(400)
    expect(response.body.message).toBeDefined()
  })
})
