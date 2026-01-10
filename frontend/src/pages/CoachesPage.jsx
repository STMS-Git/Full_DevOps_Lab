import { useEffect, useState } from 'react'
import CoachList from '../components/CoachList'
import CoachForm from '../components/CoachForm'

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadCoaches() {
    try {
      const res = await fetch('/api/coaches')
      const data = await res.json()
      setCoaches(data.data || data)
    } catch (error) {
      console.error('Error loading coaches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoaches()
  }, [])

  async function handleDelete(id) {
    const res = await fetch(`/api/coaches/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCoaches(prev => prev.filter(c => c._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading coaches...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Coaches Management</h2>
      <CoachForm onCreated={loadCoaches} />
      <CoachList coaches={coaches} onDelete={handleDelete} />
    </div>
  )
}
