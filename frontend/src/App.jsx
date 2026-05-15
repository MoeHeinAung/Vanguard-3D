import { useState } from 'react'
import DrawsPage from './pages/DrawsPage'
import SalesPage from './pages/SalesPage'
import TicketsPage from './pages/TicketsPage'
import AgentsPage from './pages/AgentsPage'
import MasterDealersPage from './pages/MasterDealersPage'
import Navbar from './components/layout/Navbar'
import { TrendingUp, BarChart3, Users, Ticket, Layers, Shield } from 'lucide-react'

function App() {
  const [currentPage, setCurrentPage] = useState('draws')

  const renderPage = () => {
    switch (currentPage) {
      case 'draws': return <DrawsPage />
      case 'sales': return <SalesPage />
      case 'tickets': return <TicketsPage />
      case 'agents': return <AgentsPage />
      case 'master-dealers': return <MasterDealersPage />
      default: return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen text-foreground antialiased">
      <Navbar onNavigate={setCurrentPage} />
      <main className="container mx-auto px-4 py-6">
        {renderPage()}
      </main>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight text-gradient mb-2">Vanguard 3D</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Professional Lottery Management System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentPage('draws')}
          className="glass-card p-6 hover-lift text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 group"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-1">Draw Management</h3>
          <p className="text-sm text-muted-foreground">Monitor draw lifecycle, cutoffs, and settlement status.</p>
        </button>

        <button
          onClick={() => setCurrentPage('sales')}
          className="glass-card p-6 hover-lift text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 group"
        >
          <div className="w-12 h-12 rounded-lg bg-tertiary-container/10 flex items-center justify-center mb-4 group-hover:bg-tertiary-container/20 transition-colors duration-200">
            <TrendingUp className="h-6 w-6 text-tertiary" />
          </div>
          <h3 className="text-lg font-bold mb-1">Sales Tracking</h3>
          <p className="text-sm text-muted-foreground">Record and manage ticket sales per draw and agent.</p>
        </button>

        <button
          onClick={() => setCurrentPage('tickets')}
          className="glass-card p-6 hover-lift text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 group"
        >
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors duration-200">
            <Ticket className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="text-lg font-bold mb-1">Ticket Summary</h3>
          <p className="text-sm text-muted-foreground">View ticket totals and aggregate revenue data.</p>
        </button>

        <button
          onClick={() => setCurrentPage('agents')}
          className="glass-card p-6 hover-lift text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 group"
        >
          <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-4 group-hover:bg-info/20 transition-colors duration-200">
            <Users className="h-6 w-6 text-info" />
          </div>
          <h3 className="text-lg font-bold mb-1">Agent Management</h3>
          <p className="text-sm text-muted-foreground">Manage agents, commissions, and JP/SP factors.</p>
        </button>

        <button
          onClick={() => setCurrentPage('master-dealers')}
          className="glass-card p-6 hover-lift text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 group"
        >
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-200">
            <Layers className="h-6 w-6 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-1">Master Dealers</h3>
          <p className="text-sm text-muted-foreground">Handle risk offloading and hold management.</p>
        </button>

        <button
          className="glass-card p-6 hover-lift text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 group opacity-60"
          disabled
        >
          <div className="w-12 h-12 rounded-lg bg-muted/10 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-1">Coming Soon</h3>
          <p className="text-sm text-muted-foreground">Reports &amp; analytics module.</p>
        </button>
      </div>
    </div>
  )
}

export default App