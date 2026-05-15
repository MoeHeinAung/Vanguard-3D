import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BarChart3, TrendingUp, Shield, Ticket, Users, Layers } from 'lucide-react'

function Navbar({ onNavigate, activePage }) {
  const navItems = [
    { id: 'draws', label: 'Draws', icon: BarChart3 },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'offload', label: 'Risk Management', icon: Shield },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'master-dealers', label: 'Dealers', icon: Layers },
  ]

  return (
    <header className="h-16 border-b border-border/40 bg-obsidian-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-full">
        <div className="flex h-full items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
               <span className="text-cyan-400 font-black text-xs">V3</span>
            </div>
            <h1 className="font-['Inter'] text-[13px] font-black uppercase tracking-[0.3em] text-slate-200 group-hover:text-white transition-colors">
              Vanguard <span className="text-cyan-500">3D</span>
            </h1>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-2 relative",
                  activePage === item.id
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <item.icon className={cn("h-3.5 w-3.5", activePage === item.id ? "text-cyan-400" : "text-slate-500")} />
                {item.label}
                {activePage === item.id && (
                  <span className="absolute bottom-[-16px] left-4 right-4 h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            ))}

            <div className="w-[1px] h-4 bg-border/40 mx-2" />

            <button
              onClick={() => onNavigate('home')}
              className={cn(
                "p-2 rounded-none border transition-all",
                activePage === 'home'
                  ? "bg-slate-100 text-obsidian-900 border-white"
                  : "bg-transparent text-slate-400 border-border/40 hover:text-white hover:border-slate-500"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar