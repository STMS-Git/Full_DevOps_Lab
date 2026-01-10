import PropTypes from 'prop-types'

export default function CoachList({ coaches, onDelete }) {
  if (coaches.length === 0) {
    return <p>No coaches yet. Add one above!</p>
  }

  // Icônes pour chaque sport
  const sportIcons = {
    Football: '⚽',
    Rugby: '🏉',
    Basketball: '🏀',
    Volleyball: '🏐',
    Tennis: '🎾'
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Coaches List ({coaches.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {coaches.map((coach) => (
          <li key={coach._id} style={{ 
            margin: '0.5rem 0', 
            padding: '1rem',
            background: '#f9f9f9',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>
                {coach.firstName} {coach.lastName}
              </strong>
              {' '}
              <span style={{ 
                background: '#667eea', 
                color: 'white', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {sportIcons[coach.specialization]} {coach.specialization}
              </span>
              <br />
              <span style={{ color: '#666' }}>📧 {coach.email}</span>
              {coach.phoneNumber && (
                <span style={{ color: '#666', marginLeft: '1rem' }}>
                  📞 {coach.phoneNumber}
                </span>
              )}
            </div>
            <button 
              onClick={() => onDelete(coach._id)}
              style={{ 
                background: '#ff4444', 
                color: 'white', 
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

CoachList.propTypes = {
  coaches: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string,
      specialization: PropTypes.string, // Ajouté
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
}
