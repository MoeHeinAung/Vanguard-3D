import { useState } from 'react'
import DrawsPage from './pages/DrawsPage'
import Navbar from './components/layout/Navbar'

function App() {
  const [currentPage, setCurrentPage] = useState('draws')

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar onNavigate={setCurrentPage} />
      <main className="container mx-auto px-4 py-6">
        {currentPage === 'draws' ? <DrawsPage /> : (
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Vanguard 3D</h1>
            <p className="text-muted-foreground">Professional Lottery Management System</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App