import { useEffect, useState } from 'react'
import TrainingList from '../components/TrainingList'
import TrainingForm from '../components/TrainingForm'

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState([])
  const [teams, setTeams] = useState([])
  const [coaches, setCoaches] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadTrainings() {
    try {
      const res = await fetch('/api/trainingSessions')
      const data = await res.json()
      setTrainings(data.data || data)
    } catch (error) {
      console.error('Error loading trainings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadResources() {
    try {
      const [teamsRes, coachesRes, facilitiesRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/coaches'),
        fetch('/api/facilities')
      ])
      const teamsData = await teamsRes.json()
      const coachesData = await coachesRes.json()
      const facilitiesData = await facilitiesRes.json()
      
      setTeams(teamsData.data || teamsData)
      setCoaches(coachesData.data || coachesData)
      setFacilities(facilitiesData.data || facilitiesData)
    } catch (error) {
      console.error('Error loading resources:', error)
    }
  }

  useEffect(() => {
    loadTrainings()
    loadResources()
  }, [])

  async function handleDelete(id) {
    const res = await fetch(`/api/trainingSessions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTrainings(prev => prev.filter(t => t._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading trainings...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🏋️ Training Sessions</h2>
      <TrainingForm 
        onCreated={loadTrainings} 
        teams={teams}
        coaches={coaches}
        facilities={facilities}
      />
      <TrainingList trainings={trainings} onDelete={handleDelete} />
    </div>
  )
}
