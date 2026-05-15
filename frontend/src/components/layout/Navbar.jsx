import { Button } from '@/components/ui/button'

function Navbar({ onNavigate }) {
  return (
    <header className="glass-navbar">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-['Inter'] text-[14px] font-bold uppercase tracking-[0.2em] text-gradient">Vanguard 3D</h1>
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('draws')} className="text-xs font-semibold uppercase tracking-wider">
              Draws
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('sales')} className="text-xs font-semibold uppercase tracking-wider">
              Sales
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('offload')} className="text-xs font-semibold uppercase tracking-wider">
              Risk Management
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('tickets')} className="text-xs font-semibold uppercase tracking-wider">
              Tickets
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('agents')} className="text-xs font-semibold uppercase tracking-wider">
              Agents
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('master-dealers')} className="text-xs font-semibold uppercase tracking-wider">
              Dealers
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')} className="text-xs font-semibold uppercase tracking-wider">
              Dashboard
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar