/* eslint-disable camelcase */
import { facilities } from '../data/facilities'

export function findAllAvailableFacilities (list_events, slot, date) {
  const IDsbusyFacilities = list_events.filter(e => e.slot_event === slot && e.date_event === date).map(e => e.facilityID_event)
  return facilities.filter(f => !IDsbusyFacilities.includes(f.id))
}
