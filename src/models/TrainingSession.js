/* eslint-disable camelcase */
import crypto from 'crypto'

export default class TrainingSession {
  constructor ({ date_event, slot_event, facilityId_event, coachId_event }) {
    this.id = crypto.randomUUID()
    this.type_event = 'training'
    this.date_event = date_event
    this.slot_event = slot_event
    this.facilityId_event = facilityId_event
    this.coachId_event = coachId_event
    this.event_created_At = new Date()
  }
}
