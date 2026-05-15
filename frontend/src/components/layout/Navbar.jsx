import { Button } from '@/components/ui/button'

function Navbar({ onNavigate }) {
  return (
    <header className="glass-navbar">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gradient tracking-widest">VANGUARD 3D</h1>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => onNavigate('draws')}>
              Draws
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('sales')}>
              Sales
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('agents')}>
              Agents
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('master-dealers')}>
              Master Dealers
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('home')}>
              Dashboard
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar