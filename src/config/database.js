import mongoose from 'mongoose'
import { coachesdata } from '../data/coaches.data.js'
import { dataFacilities } from '../data/facilities.data.js'
import { dataTeams } from '../data/teams.data.js'
import { dataTraining } from '../data/trainings.data.js'
import { dataMatch } from '../data/matches.data.js'
import Coach from '../models/Coach.js'
import Facility from '../models/Facility.js'
import Team from '../models/Team.js'
import dotenv from 'dotenv'
import TrainingSession from '../models/TrainingSession.js'
import MatchSession from '../models/MatchSession.js'

dotenv.config()
const getIDCoach = (listC, firstName, lastName) => listC.find(
  c => c.firstName.toUpperCase() === firstName.toUpperCase() && c.lastName.toUpperCase() === lastName.toUpperCase()
)?._id

const getIDFacility = (listF, nameF) => listF.find(f => f.name.toUpperCase() === nameF.toUpperCase())?._id
const getIDTeam = (listT, nameT) => listT.find(t => t.name.toUpperCase() === nameT.toUpperCase())?._id

const samples = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    await MatchSession.deleteMany({})
    await TrainingSession.deleteMany({})
    await Coach.deleteMany({})
    await Facility.deleteMany({})
    await Team.deleteMany({})
    const coachesCreated = await Coach.insertMany(coachesdata)
    console.log('The insertions of the coaches have been done successfully')

    const facilitiesCreated = await Facility.insertMany(dataFacilities)
    console.log('The insertions of the facilities have been done successfully')

    const teamsCreated = await Team.insertMany(dataTeams)
    console.log('The insertions of the teams have been done successfully')

    const mappingTrainings = dataTraining.map(t => {
      const IDcoach = getIDCoach(coachesCreated, t.coachFirstName, t.coachLastName)
      const IDfacility = getIDFacility(facilitiesCreated, t.facilityName)
      const IDteam = getIDTeam(teamsCreated, t.teamName)

      if (!IDfacility || !IDcoach || !IDteam) {
        throw new Error(`Error during the mapping of training event: ${JSON.stringify(t)}`)
      }
      return { eventType: t.eventType, eventDate: t.eventDate, eventSlot: t.eventSlot, duration: t.duration, trainingLevel: t.trainingLevel, trainingType: t.trainingType, facilityId: IDfacility, coachId: IDcoach, teamId: IDteam, maxParticipants: t.maxParticipants, description: t.description, isMandatory: t.isMandatory }
    })
    await TrainingSession.insertMany(mappingTrainings)
    console.log('The insertions of the training sessions have been done successfully')

    const mappingMatches = dataMatch.map(m => {
      const IDFirstTeam = getIDTeam(teamsCreated, m.team1Name)
      const IDSecondTeam = getIDTeam(teamsCreated, m.team2Name)
      const IDfacility = getIDFacility(facilitiesCreated, m.facilityName)
      const IDcoach = getIDCoach(coachesCreated, m.coachFirstName, m.coachLastName)

      if (!IDfacility || !IDcoach || !IDFirstTeam || !IDSecondTeam) {
        throw new Error(`Error during the mapping of match event: ${JSON.stringify(m)}`)
      }
      return { eventType: m.eventType, eventDate: m.eventDate, eventSlot: m.eventSlot, facilityId: IDfacility, coachId: IDcoach, team1Id: IDFirstTeam, team2Id: IDSecondTeam }
    })

    await MatchSession.insertMany(mappingMatches)
    console.log('The insertions of the match sessions have been done successfully')
    process.exit()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

samples()
