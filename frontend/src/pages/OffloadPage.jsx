import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { callPython } from '../utils/bridge';
import { ChevronDown, ChevronRight, Building2, Plus, Search, Settings2, ShieldCheck } from 'lucide-react';

const OffloadPage = () => {
  const [dealers, setDealers] = useState([]);
  const [offloads, setOffloads] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState('');
  
  const [activeTab, setActiveTab] = useState('History');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = async () => {
    try {
      const drawsData = await callPython('get_draws');
      const dealersData = await callPython('get_master_dealers');
      const offloadsData = await callPython('get_offloads');
      
      const openDraw = drawsData.find(d => d.status === 'Open');
      setDraws(drawsData.filter(d => d.status === 'Open'));
      setDealers(dealersData);
      setSelectedDraw(openDraw);
      setOffloads(offloadsData.filter(o => o.draw_id === openDraw?.id));
    } catch (error) {
      console.error('Failed to fetch offload data:', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const offloadAggregates = useMemo(() => {
    const summary = {};
    offloads.forEach(o => {
      if (!summary[o.ticket]) {
        summary[o.ticket] = { total: 0 };
      }
      summary[o.ticket].total += o.amount;
    });

    return Object.entries(summary).map(([ticket, data]) => ({
      ticket,
      total: data.total
    })).sort((a, b) => b.total - a.total);
  }, [offloads]);

  const totals = useMemo(() => {
    return offloadAggregates.reduce((acc, curr) => acc + curr.total, 0);
  }, [offloadAggregates]);

  const filteredDealers = useMemo(() => {
    return dealers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [dealers, searchTerm]);

  const groupedOffloads = useMemo(() => {
    const groups = {};
    offloads.forEach(o => {
      const key = o.created_at || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(o);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [offloads]);

  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return groupedOffloads.slice(start, start + itemsPerPage);
  }, [groupedOffloads, currentPage]);

  const handleSubmit = async () => {
    if (!selectedDraw || !selectedDealer) return alert('Select Draw and Dealer');
    try {
      await callPython('create_offload', {
        draw_id: selectedDraw.id,
        master_dealer_id: selectedDealer.id,
        input_text: inputText,
        notes: notes
      });
      setInputText(''); 
      setNotes(''); 
      setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      alert('Failed to record offload');
    }
  };

  const tabs = [
    { id: 'History', label: 'Offload History' },
    { id: 'Totals', label: 'Ticket Totals' }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Bar: Configuration */}
      <header className="flex-none p-4 border-b border-border bg-card/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gradient uppercase tracking-widest">Risk Offloading</h1>
          <div className="h-6 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <span className="badge-elegant badge-elegant-info">{selectedDraw?.draw_date || 'No Draw'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-tighter">
          <ShieldCheck size={16} className="text-primary" />
          <span>Liability Management</span>
        </div>
      </header>

      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar: Master Dealers */}
        <aside className="w-80 flex-none border-r border-border bg-card/10 flex flex-col overflow-hidden">
          <div className="flex-none p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search dealers..." 
                className="pl-9 h-9 bg-background/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground tracking-tighter">
              <span>Master Dealers</span>
              <span>{filteredDealers.length} Available</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-1 pb-4">
            {filteredDealers.map(dealer => (
              <button
                key={dealer.id}
                onClick={() => { setSelectedDealer(dealer); setIsDialogOpen(true); }}
                className="w-full flex items-center gap-3 p-3 text-left transition-all hover:bg-primary/5 group relative border border-transparent hover:border-primary/10"
              >
                <div className="h-10 w-10 flex-none flex items-center justify-center bg-slate-900 border border-border group-hover:border-primary/30 transition-colors">
                  <Building2 size={18} className="text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{dealer.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">{dealer.id}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={16} className="text-primary" />
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Right Content: Data Table */}
        <section className="flex-1 flex flex-col bg-background/50 overflow-hidden">
          <div className="flex-none p-4 pb-0 flex items-center justify-between bg-card/5 border-b border-border/30">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary glow-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 p-4 overflow-hidden">
            <Card className="glass-card flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <table className="data-table">
                  <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm">
                    {activeTab === 'History' ? (
                      <tr>
                        <th className="w-10" />
                        <th>Time</th>
                        <th>Master Dealer</th>
                        <th className="text-right">Tickets</th>
                        <th className="text-right">Total</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>Ticket #</th>
                        <th className="text-right">Total Offloaded</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {activeTab === 'History' && paginatedGroups.map(([timestamp, group]) => {
                      const isExpanded = expandedGroups[timestamp];
                      const totalAmount = group.reduce((sum, o) => sum + o.amount, 0);
                      return (
                        <React.Fragment key={timestamp}>
                          <tr className="cursor-pointer group" onClick={() => setExpandedGroups({...expandedGroups, [timestamp]: !isExpanded})}>
                            <td>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                            <td className="font-mono text-xs">{new Date(timestamp).toLocaleTimeString()}</td>
                            <td className="font-bold">{group[0].master_dealer_name}</td>
                            <td className="text-right font-mono">{group.length}</td>
                            <td className="text-right font-mono text-primary font-bold">{totalAmount.toLocaleString()}</td>
                          </tr>
                          {isExpanded && group.map(o => (
                            <tr key={o.id} className="bg-white/5 text-xs">
                              <td />
                              <td colSpan={2} className="text-muted-foreground italic pl-4">{o.notes || '—'}</td>
                              <td className="text-right font-mono">{o.ticket}</td>
                              <td className="text-right font-mono">{o.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}

                    {activeTab === 'Totals' && offloadAggregates.map((item) => (
                      <tr key={item.ticket}>
                        <td className="font-mono font-bold text-primary">{item.ticket}</td>
                        <td className="text-right font-mono font-bold">
                          {item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Row */}
              <div className="flex-none border-t border-primary/20 bg-primary/5 p-4 flex justify-between items-center">
                <div className="text-xs font-bold uppercase tracking-widest text-primary/70">Global Offload Summary</div>
                <div className="text-xl font-mono font-bold text-primary">
                  { (activeTab === 'History' 
                      ? groupedOffloads.reduce((acc, [_, g]) => acc + g.reduce((s, x) => s + x.amount, 0), 0)
                      : totals
                    ).toLocaleString() }
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Offload Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary" size={20} />
              <span>Record Offload: <span className="text-primary">{selectedDealer?.name}</span></span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Risk Transfer Panel</Label>
              <Textarea 
                placeholder="Example: 123 = 5000" 
                rows={10} 
                className="bg-background/60 font-mono text-lg border-primary/10 focus:border-primary/40 transition-all"
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
              />
              <p className="text-[10px] text-muted-foreground uppercase text-center font-mono">Format: TICKET = AMOUNT per line</p>
            </div>
            <div className="space-y-2">
              <Input 
                placeholder="Offload batch reference/notes..." 
                className="bg-background/40 h-10"
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>
            <Button className="w-full btn-primary-gradient h-12 text-lg uppercase tracking-tighter font-black" onClick={handleSubmit}>
              Confirm Risk Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffloadPage;
