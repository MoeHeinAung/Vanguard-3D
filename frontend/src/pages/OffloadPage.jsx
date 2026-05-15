import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { callPython } from '../utils/bridge';
import { 
  ChevronDown, 
  ChevronRight, 
  ShieldAlert, 
  Plus, 
  Settings2, 
  ShieldCheck, 
  ArrowUpRight, 
  FileOutput,
  LayoutDashboard,
  Filter
} from 'lucide-react';

const OffloadPage = () => {
  const [offloads, setOffloads] = useState([]);
  const [sales, setSales] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  
  // Persistent Settings
  const [adminHold, setAdminHold] = useState(5000);
  const [maxOffloadAmount, setMaxOffloadAmount] = useState(10000);
  const [maxOffloadTicket, setMaxOffloadTicket] = useState(10);
  
  // UI State
  const [leftView, setLeftView] = useState('Pending'); // Holding, Pending, Offloaded
  const [rightView, setRightView] = useState('Pending'); // Pending, Offloaded
  
  const fetchData = async () => {
    try {
      const drawsData = await callPython('get_draws');
      const offloadsData = await callPython('get_offloads');
      const salesData = await callPython('get_sales');
      
      const hold = await callPython('get_setting', 'admin_hold', '5000');
      const maxAmt = await callPython('get_setting', 'max_offload_amount', '10000');
      const maxTkt = await callPython('get_setting', 'max_offload_ticket', '10');
      
      const openDraw = drawsData.find(d => d.status === 'Open');
      setDraws(drawsData.filter(d => d.status === 'Open'));
      setSelectedDraw(openDraw);
      setOffloads(offloadsData.filter(o => o.draw_id === openDraw?.id));
      setSales(salesData.filter(s => s.draw_id === openDraw?.id));
      
      setAdminHold(Number(hold));
      setMaxOffloadAmount(Number(maxAmt));
      setMaxOffloadTicket(Number(maxTkt));
    } catch (error) {
      console.error('Failed to fetch offload data:', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSettingChange = async (key, val) => {
    const numVal = Number(val);
    if (key === 'admin_hold') setAdminHold(numVal);
    if (key === 'max_offload_amount') setMaxOffloadAmount(numVal);
    if (key === 'max_offload_ticket') setMaxOffloadTicket(numVal);
    await callPython('update_setting', key, numVal);
  };

  const riskAggregates = useMemo(() => {
    const summary = {};
    sales.forEach(s => {
      if (!summary[s.ticket]) summary[s.ticket] = { sales: 0, offloaded: 0 };
      summary[s.ticket].sales += s.amount;
    });
    offloads.forEach(o => {
      if (!summary[o.ticket]) summary[o.ticket] = { sales: 0, offloaded: 0 };
      summary[o.ticket].offloaded += o.amount;
    });

    return Object.entries(summary).map(([ticket, data]) => {
      const holding = Math.min(data.sales, adminHold);
      const pending = Math.max(data.sales - adminHold - data.offloaded, 0);
      return {
        ticket,
        sales: data.sales,
        offloaded: data.offloaded,
        holding,
        pending
      };
    }).sort((a, b) => b.sales - a.sales);
  }, [sales, offloads, adminHold]);

  const leftTableData = useMemo(() => {
    if (leftView === 'Holding') return riskAggregates.filter(i => i.holding > 0);
    if (leftView === 'Pending') return riskAggregates.filter(i => i.pending > 0);
    if (leftView === 'Offloaded') return riskAggregates.filter(i => i.offloaded > 0);
    return [];
  }, [riskAggregates, leftView]);

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden p-4 gap-4">
      {/* 1. Top Control Bar */}
      <header className="flex-none glass-card p-4 border-primary/10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Admin Hold Amount</Label>
            <Input 
              type="number" 
              value={adminHold} 
              onChange={(e) => handleSettingChange('admin_hold', e.target.value)}
              className="h-9 w-32 bg-background/40 font-mono text-primary font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Max Offload Amount</Label>
            <Input 
              type="number" 
              value={maxOffloadAmount} 
              onChange={(e) => handleSettingChange('max_offload_amount', e.target.value)}
              className="h-9 w-32 bg-background/40 font-mono text-cyan-400"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Max Offload Ticket</Label>
            <Input 
              type="number" 
              value={maxOffloadTicket} 
              onChange={(e) => handleSettingChange('max_offload_ticket', e.target.value)}
              className="h-9 w-32 bg-background/40 font-mono text-amber-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-px bg-border/50 mx-2" />
          <Button className="btn-primary-gradient px-8 h-10 uppercase tracking-tighter font-black group">
            <ArrowUpRight className="mr-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            Perform Offload
          </Button>
        </div>
      </header>

      <main className="flex-1 flex min-h-0 gap-4 overflow-hidden">
        {/* 2. Left Main Table: Dynamic View */}
        <section className="flex-1 flex flex-col glass-card overflow-hidden border-primary/5">
          <div className="flex-none p-2 border-b border-border/30 flex gap-1 bg-white/5">
            {['Holding', 'Pending', 'Offloaded'].map(view => (
              <button
                key={view}
                onClick={() => setLeftView(view)}
                className={`flex-1 py-2 text-[10px] uppercase font-black tracking-widest transition-all relative ${
                  leftView === view ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {view} View
                {leftView === view && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary glow-sm" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <table className="data-table">
              <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm shadow-sm">
                <tr>
                  <th className="w-16">#</th>
                  <th>Ticket Number</th>
                  <th className="text-right">
                    {leftView === 'Holding' ? 'Held Amount' : 
                     leftView === 'Pending' ? 'Pending Amount' : 'Offloaded Amount'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {leftTableData.map((item, idx) => (
                  <tr key={item.ticket} className="group">
                    <td className="text-muted-foreground font-mono text-[10px]">{idx + 1}</td>
                    <td className="font-mono font-bold text-sm tracking-widest">{item.ticket}</td>
                    <td className="text-right font-mono font-bold text-primary">
                      { (leftView === 'Holding' ? item.holding :
                         leftView === 'Pending' ? item.pending : item.offloaded).toLocaleString() }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-none p-3 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Total {leftView}</span>
            <span className="text-lg font-mono font-bold text-primary">
              { leftTableData.reduce((acc, curr) => acc + (
                leftView === 'Holding' ? curr.holding :
                leftView === 'Pending' ? curr.pending : curr.offloaded
              ), 0).toLocaleString() }
            </span>
          </div>
        </section>

        {/* 3. Right Preview Table: Export Template */}
        <section className="w-[450px] flex flex-col glass-card overflow-hidden border-cyan-500/10">
          <div className="flex-none p-4 border-b border-border/30 flex items-center justify-between bg-cyan-500/5">
            <div className="flex items-center gap-2">
              <FileOutput size={16} className="text-cyan-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400">Export Preview</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase ${rightView === 'Pending' ? 'text-cyan-400' : 'text-muted-foreground'}`}>Pending</span>
              <Switch 
                checked={rightView === 'Offloaded'} 
                onCheckedChange={(checked) => setRightView(checked ? 'Offloaded' : 'Pending')}
              />
              <span className={`text-[10px] font-bold uppercase ${rightView === 'Offloaded' ? 'text-cyan-400' : 'text-muted-foreground'}`}>Offloaded</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-background/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,247,255,0.03)_0,transparent_70%)]" />
            <div className="text-center space-y-3 relative z-10 px-8">
              <div className="h-12 w-12 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center mx-auto mb-4 bg-cyan-500/5">
                <LayoutDashboard size={20} className="text-cyan-500/40" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Template Engine Standby</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground/40 max-w-[200px] mx-auto italic">
                Export data for {rightView} tickets will appear here once logic is initialized.
              </p>
            </div>
          </div>

          <div className="flex-none p-4 border-t border-border/30 bg-background/40">
            <Button disabled variant="outline" className="w-full border-cyan-500/20 text-cyan-500/50 uppercase text-[10px] font-bold h-9">
              Generate Export Template
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OffloadPage;
