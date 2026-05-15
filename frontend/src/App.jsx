import { useState } from 'react'
import DrawsPage from './pages/DrawsPage'
import SalesPage from './pages/SalesPage'
import TicketsPage from './pages/TicketsPage'
import AgentsPage from './pages/AgentsPage'
import MasterDealersPage from './pages/MasterDealersPage'
import OffloadPage from './pages/OffloadPage'
import Navbar from './components/layout/Navbar'
import { TrendingUp, BarChart3, Users, Ticket, Layers, Shield, Zap } from 'lucide-react'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'draws': return <DrawsPage />
      case 'sales': return <SalesPage />
      case 'tickets': return <TicketsPage />
      case 'agents': return <AgentsPage />
      case 'master-dealers': return <MasterDealersPage />
      case 'offload': return <OffloadPage />
      default: return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden text-foreground antialiased bg-background">
      <Navbar onNavigate={setCurrentPage} activePage={currentPage} />
      <main className="flex-1 min-h-0 overflow-hidden relative">
        <div key={currentPage} className="h-full w-full animate-page-fade">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

function Dashboard({ onNavigate }) {
  return (
    <div className="h-full overflow-y-auto p-8 scrollbar-thin bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.1),transparent_50%)]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center py-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full -z-10" />
          <h1 className="text-6xl font-black tracking-tighter text-gradient mb-4">VANGUARD 3D</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-border/40" />
            <p className="text-slate-500 text-xs uppercase tracking-[0.4em] font-bold">Terminal Interface v4.0</p>
            <div className="h-[1px] w-12 bg-border/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Operational Hubs */}
          <button
            onClick={() => onNavigate('draws')}
            className="corner-accent glass-card p-8 text-left transition-all duration-300 hover:border-cyan-500/50 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
            </div>
            <div className="w-12 h-12 rounded-none border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors duration-200">
              <BarChart3 className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight text-slate-200">DRAWS</h3>
            <p className="text-sm text-slate-500 leading-relaxed uppercase tracking-wide font-medium">Control the lifecycle of lottery events and settlement thresholds.</p>
          </button>

          <button
            onClick={() => onNavigate('sales')}
            className="corner-accent glass-card p-8 text-left transition-all duration-300 hover:border-violet-500/50 group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
            </div>
            <div className="w-12 h-12 rounded-none border border-violet-500/30 bg-violet-500/5 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors duration-200">
              <TrendingUp className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight text-slate-200">SALES ENGINE</h3>
            <p className="text-sm text-slate-500 leading-relaxed uppercase tracking-wide font-medium">Real-time ingestion and validation of multi-agent ticket streams.</p>
          </button>

          <button
            onClick={() => onNavigate('offload')}
            className="corner-accent glass-card p-8 text-left transition-all duration-300 hover:border-emerald-500/50 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
            </div>
            <div className="w-12 h-12 rounded-none border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors duration-200">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight text-slate-200">RISK MANAGEMENT</h3>
            <p className="text-sm text-slate-500 leading-relaxed uppercase tracking-wide font-medium">Automated offloading of liabilities to master dealer networks.</p>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <button
            onClick={() => onNavigate('tickets')}
            className="glass-card p-8 text-left transition-all duration-300 hover:border-cyan-500/30 group flex items-center gap-6"
          >
            <div className="w-16 h-16 flex-none rounded-none border border-slate-700 bg-slate-800/50 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
              <Ticket className="h-8 w-8 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-200">TICKET AGGREGATOR</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Global revenue distribution and unique ticket tracking.</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('agents')}
            className="glass-card p-8 text-left transition-all duration-300 hover:border-violet-500/30 group flex items-center gap-6"
          >
            <div className="w-16 h-16 flex-none rounded-none border border-slate-700 bg-slate-800/50 flex items-center justify-center group-hover:border-violet-500/50 transition-colors">
              <Users className="h-8 w-8 text-slate-400 group-hover:text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-200">NETWORK NODES</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Manage agent hierarchies, commission logic, and JP factors.</p>
            </div>
          </button>
        </div>

        <div className="pt-12 border-t border-border/40 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">System Online: All Nodes Authenticated</span>
           </div>
           <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600">
              © 2024 VANGUARD ANALYTICS CORP
           </div>
        </div>
      </div>
    </div>
  )
}

export default App