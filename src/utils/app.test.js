import request from 'supertest'
import app from '../../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Application routes tested', () => {
  it('GET / that should return hello message', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('ok', true)
    expect(res.body).toHaveProperty('message', 'Hello from CI/CD demo')
  })

  it('GET /health that should return 200 OK', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.text).toBe('OK')
  })
})
