import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import CoachesPage from './pages/CoachesPage'
import TeamsPage from './pages/TeamsPage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coaches" element={<CoachesPage />} />
         <Route path="/teams" element={<TeamsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
