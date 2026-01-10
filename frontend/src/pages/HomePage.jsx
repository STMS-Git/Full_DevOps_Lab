import { useEffect, useState } from 'react'

export default function HomePage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h2>Welcome to STMS</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p style={{ fontSize: '1.2rem', color: '#555' }}>{message}</p>
      )}
    </div>
  )
}
