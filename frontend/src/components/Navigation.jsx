import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav style={{ 
      background: '#f0f0f0', 
      padding: '1rem',
      display: 'flex',
      gap: '2rem',
      justifyContent: 'center',
      borderBottom: '2px solid #ddd'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        Home
      </Link>
      <Link to="/coaches" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        Coaches
      </Link>
      <Link to="/teams" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        Teams
      </Link>
    </nav>
  )
}
