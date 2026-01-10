import { useEffect, useState } from 'react'
import MatchList from '../components/MatchList'
import MatchForm from '../components/MatchForm'

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [coaches, setCoaches] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadMatches() {
    try {
      const res = await fetch('/api/matchSessions')
      const data = await res.json()
      setMatches(data.data || data)
    } catch (error) {
      console.error('Error loading matches:', error)
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
    loadMatches()
    loadResources()
  }, [])

  async function handleDelete(id) {
    const res = await fetch(`/api/matchSessions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMatches(prev => prev.filter(m => m._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading matches...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>⚽ Match Sessions</h2>
      <MatchForm 
        onCreated={loadMatches} 
        teams={teams}
        coaches={coaches}
        facilities={facilities}
      />
      <MatchList matches={matches} onDelete={handleDelete} />
    </div>
  )
}
