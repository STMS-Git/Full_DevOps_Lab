/**
 * Unit tests for src/utils/errorHandler.js.
 * We stub a minimal `res` object to capture status and body.
 */
import { describe, it, expect } from 'vitest'
import { errorHandler } from '../../src/utils/errorHandler.js'

function makeRes () {
  return {
    statusCode: 0,
    body: null,
    status (code) { this.statusCode = code; return this },
    json (obj) { this.body = obj; return this }
  }
}

describe('errorHandler', () => {
  it('defaults to 500 with generic message', () => {
    const res = makeRes()
    errorHandler({}, {}, res, () => {})
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: true, message: 'Internal Server Error' })
  })

  it('uses provided status and message', () => {
    const res = makeRes()
    errorHandler({ status: 418, message: 'teapot' }, {}, res, () => {})
    expect(res.statusCode).toBe(418)
    expect(res.body).toEqual({ error: true, message: 'teapot' })
  })

  it('treats Mongoose ValidationError', () => {
    const response = makeRes()
    const err = { name: 'ValidationError', errors: { field1: { message: 'Field1 required' }, field2: { message: 'Field2 too short' } } }

    errorHandler(err, {}, response, () => {})
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: true, message: 'Validation error', details: ['Field1 required', 'Field2 too short'] })
  })

  it('treats Mongoose CastError', () => {
    const response = makeRes()
    const err = { name: 'CastError' }
    errorHandler(err, {}, response, () => {})
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: true, message: 'Invalid ID format' })
  })

  it('treats duplicate error', () => {
    const response = makeRes()
    const err = { code: 11000, keyPattern: { email: 1 } }
    errorHandler(err, {}, response, () => {})
    expect(response.statusCode).toBe(409)
    expect(response.body).toEqual({ error: true, message: 'Duplicate entry', field: 'email' })
  })
})
