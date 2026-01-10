import { useEffect, useState } from 'react'
import FacilityList from '../components/FacilityList'
import FacilityForm from '../components/FacilityForm'

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadFacilities() {
    try {
      const res = await fetch('/api/facilities')
      const data = await res.json()
      setFacilities(data.data || data)
    } catch (error) {
      console.error('Error loading facilities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFacilities()
  }, [])

  async function handleDelete(id) {
    const res = await fetch(`/api/facilities/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setFacilities(prev => prev.filter(f => f._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading facilities...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🏟️ Facilities Management</h2>
      <FacilityForm onCreated={loadFacilities} />
      <FacilityList facilities={facilities} onDelete={handleDelete} />
    </div>
  )
}
