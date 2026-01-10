import { useEffect, useState } from 'react'
import TeamList from '../components/TeamList'
import TeamForm from '../components/TeamForm'

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadTeams() {
    try {
      const res = await fetch('/api/teams')
      const data = await res.json()
      setTeams(data.data || data)
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCoaches() {
    try {
      const res = await fetch('/api/coaches')
      const data = await res.json()
      setCoaches(data.data || data)
    } catch (error) {
      console.error('Error loading coaches:', error)
    }
  }

  useEffect(() => {
    loadTeams()
    loadCoaches()
  }, [])

  async function handleDelete(id) {
    const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTeams(prev => prev.filter(t => t._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading teams...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Teams Management</h2>
      <TeamForm onCreated={loadTeams} coaches={coaches} />
      <TeamList teams={teams} onDelete={handleDelete} />
    </div>
  )
}
