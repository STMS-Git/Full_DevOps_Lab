import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app.js'

describe('Base routes and middleware for the app', () => {
  describe('GET /', () => {
    it('display the hello message', async () => {
      const response = await request(app).get('/').expect(200)

      expect(response.body).toEqual({ ok: true, message: 'Hello from CI/CD demo' })
    })
  })
})

describe('GET /health', () => {
  it('display OK', async () => {
    const response = await request(app).get('/health').expect(200)
    expect(response.text).toBe('OK')
  })
})

describe('Middleware for the authentification', () => {
  it('should attach coach user when the token for the coach is given', async () => {
    const response = await request(app).get('/version').set('Authorization', 'Bearer coach-token').expect(200)
    expect(response.body).toBeDefined()
  })

  it('should player coach user when the token for the player is given', async () => {
    const response = await request(app).get('/version').set('Authorization', 'Bearer player-token').expect(200)
    expect(response.body).toBeDefined()
  })

  it('should make the request of the user null when the token is not given', async () => {
    const response = await request(app).get('/version').expect(200)
    expect(response.body).toBeDefined()
  })
})
