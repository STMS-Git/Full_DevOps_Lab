/* eslint-disable camelcase */
import crypto from 'crypto'

export default class MatchSession {
  constructor ({ date_event, slot_event, facilityID_event, coachId_event, teamID_event }) {
    this.id = crypto.randomUUID()
    this.type_event = 'match'
    this.date_event = date_event
    this.slot_event = slot_event
    this.facilityID_event = facilityID_event
    this.coachId_event = coachId_event
    this.teamID_event = teamID_event
    this.event_created_At = new Date()
  }
}
