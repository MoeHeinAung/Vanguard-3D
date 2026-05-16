import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { callPython } from '../utils/bridge';
import { ChevronDown, ChevronRight, TrendingUp, Plus, User, Search, Settings2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

const SalesPage = () => {
  const [agents, setAgents] = useState([]);
  const [sales, setSales] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [adminHold, setAdminHold] = useState(5000);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentFilter, setAgentFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState('');
  
  const [activeTab, setActiveTab] = useState('History');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { notifySuccess, notifyError } = useNotification();

  const fetchData = async () => {
    try {
      const drawsData = await callPython('get_draws');
      const agentsData = await callPython('get_agents');
      const salesData = await callPython('get_sales');
      const hold = await callPython('get_setting', 'admin_hold', '5000');
      
      const openDraw = drawsData.find(d => d.status === 'Open');
      setDraws(drawsData.filter(d => d.status === 'Open'));
      setAgents(agentsData);
      setSelectedDraw(openDraw);
      setSales(salesData.filter(s => s.draw_id === openDraw?.id));
      setAdminHold(Number(hold));
    } catch (error) {
      notifyError(`Failed to fetch sales data: ${error.message}`);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleHoldChange = async (val) => {
    try {
      const newVal = Number(val);
      setAdminHold(newVal);
      await callPython('update_setting', 'admin_hold', newVal);
      notifySuccess('Admin hold updated');
    } catch (error) {
      notifyError(`Failed to update setting: ${error.message}`);
    }
  };

  const filteredSales = useMemo(() => {
    if (!agentFilter) return sales;
    return sales.filter(s => s.agent_id === agentFilter.id);
  }, [sales, agentFilter]);

  const agentSummary = useMemo(() => {
    if (!agentFilter) return null;
    const total = filteredSales.reduce((sum, s) => sum + s.amount, 0);
    const uniqueTickets = new Set(filteredSales.map(s => s.ticket)).size;
    const commission = (total * (agentFilter.commission || 0)) / 100;
    return { total, uniqueTickets, commission };
  }, [filteredSales, agentFilter]);

  const ticketAggregates = useMemo(() => {
    const summary = {};
    filteredSales.forEach(s => {
      if (!summary[s.ticket]) summary[s.ticket] = { total: 0 };
      summary[s.ticket].total += s.amount;
    });

    return Object.entries(summary).map(([ticket, data]) => ({
      ticket,
      total: data.total
    })).sort((a, b) => b.total - a.total);
  }, [filteredSales]);

  const totals = useMemo(() => {
    return ticketAggregates.reduce((acc, curr) => acc + curr.total, 0);
  }, [ticketAggregates]);

  const filteredAgents = useMemo(() => {
    return agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [agents, searchTerm]);

  const groupedSales = useMemo(() => {
    const groups = {};
    filteredSales.forEach(s => {
      const key = s.created_at || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [filteredSales]);

  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return groupedSales.slice(start, start + itemsPerPage);
  }, [groupedSales, currentPage]);

  const handleSubmit = async () => {
    if (!selectedDraw || !selectedAgent) {
      notifyError('Select Draw and Agent first');
      return;
    }
    try {
      await callPython('create_sales', {
        draw_id: selectedDraw.id,
        agent_id: selectedAgent.id,
        input_text: inputText,
        notes: notes
      });
      notifySuccess('Sale recorded successfully');
      setInputText(''); setNotes(''); setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      notifyError(`Failed to record sale: ${error.message}`);
    }
  };

  const tabs = [
    { id: 'History', label: 'History' },
    { id: 'Ticket', label: 'Ticket' }
  ];

  const overallSummary = useMemo(() => {
    const total = sales.reduce((sum, s) => sum + s.amount, 0);
    const uniqueTickets = new Set(sales.map(s => s.ticket)).size;
    const commission = sales.reduce((sum, s) => {
      const agent = agents.find(a => a.id === s.agent_id);
      return sum + (s.amount * (agent?.commission || 0) / 100);
    }, 0);
    return { total, uniqueTickets, commission };
  }, [sales, agents]);

  const summaryData = agentFilter ? agentSummary : overallSummary;

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Bar: Page Context */}
      <header className="flex-none p-4 glass-navbar border-b border-border bg-card/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gradient uppercase tracking-widest">Sales Engine</h1>
          <div className="h-6 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <span className="badge-elegant badge-elegant-info">{selectedDraw?.draw_date || 'No Draw'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-tighter">
          <User size={16} className="text-primary" />
          <span>{agentFilter ? `Agent: ${agentFilter.name}` : 'All Agents Operations'}</span>
        </div>
      </header>

      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar: Agents (Full Height) */}
        <aside className="w-80 flex-none border-r border-border bg-card/10 flex flex-col overflow-hidden h-full">
          <div className="flex-none p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search agents..." 
                className="pl-9 h-9 bg-background/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground tracking-tighter">
              <span>Agents</span>
              <span>{filteredAgents.length} Active</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-1 pb-4">
            {filteredAgents.map(agent => (
              <div
                key={agent.id}
                className={`w-full flex items-center gap-3 p-3 text-left transition-all group relative border cursor-pointer ${
                  agentFilter?.id === agent.id 
                  ? 'bg-primary/10 border-primary/20' 
                  : 'hover:bg-primary/5 border-transparent hover:border-primary/10'
                }`}
                onClick={() => setAgentFilter(agentFilter?.id === agent.id ? null : agent)}
              >
                <div className="h-10 w-10 flex-none flex items-center justify-center bg-slate-900 border border-border group-hover:border-primary/30 transition-colors">
                  <User size={18} className={agentFilter?.id === agent.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm truncate transition-colors ${agentFilter?.id === agent.id ? 'text-primary' : 'group-hover:text-primary'}`}>{agent.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">{agent.id}</div>
                </div>
                <button 
                  className="p-1 hover:bg-primary/20 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAgent(agent);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus size={18} className="text-primary" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content: Fixed Summary Cards + Scrollable Data Table */}
        <section className="flex-1 flex flex-col bg-background/50 overflow-hidden">
          {/* Fixed Summary Cards */}
          <div className="flex-none p-4 pb-2 border-b border-border/30 bg-card/10">
            <Card className="glass-card border-primary/20 bg-primary/5">
              <CardContent className="p-4 grid grid-cols-3 gap-6">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                    {agentFilter ? 'Total Sales' : 'Global Sales'}
                  </Label>
                  <div className="text-2xl font-mono font-bold text-primary">${summaryData.total.toLocaleString()}</div>
                </div>
                <div className="space-y-1 border-x border-border/30 px-6">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                    {agentFilter ? `Commission (${agentFilter.commission}%)` : 'Total Commission Payable'}
                  </Label>
                  <div className="text-2xl font-mono font-bold text-amber-400">${summaryData.commission.toLocaleString()}</div>
                </div>
                <div className="space-y-1 text-right">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Unique Tickets</Label>
                  <div className="text-2xl font-mono font-bold text-cyan-400">{summaryData.uniqueTickets}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Container (Scrollable) */}
          <div className="flex-none p-4 pb-0 flex items-center justify-between bg-card/5 mt-2">
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
            {agentFilter && (
              <div className="text-[10px] font-bold uppercase text-primary/70 pr-4">
                Filtering by: {agentFilter.name}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 p-4 overflow-hidden">
            <Card className="glass-card flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <table className="data-table">
                  <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-border/30">
                    {activeTab === 'History' ? (
                      <tr>
                        <th className="w-10" />
                        <th>Time</th>
                        <th>Agent</th>
                        <th className="text-right">Tickets</th>
                        <th className="text-right">Total</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>Ticket #</th>
                        <th className="text-right">Total Amount</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {activeTab === 'History' && paginatedGroups.map(([timestamp, group]) => {
                      const isExpanded = expandedGroups[timestamp];
                      const totalAmount = group.reduce((sum, s) => sum + s.amount, 0);
                      return (
                        <React.Fragment key={timestamp}>
                          <tr className="cursor-pointer group" onClick={() => setExpandedGroups({...expandedGroups, [timestamp]: !isExpanded})}>
                            <td>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                            <td className="font-mono text-xs">{new Date(timestamp).toLocaleTimeString()}</td>
                            <td className="font-bold">{group[0].agent_name}</td>
                            <td className="text-right font-mono">{group.length}</td>
                            <td className="text-right font-mono text-primary font-bold">{totalAmount.toLocaleString()}</td>
                          </tr>
                          {isExpanded && group.map(s => (
                            <tr key={s.id} className="bg-white/5 text-xs">
                              <td />
                              <td colSpan={2} className="text-muted-foreground italic pl-4">{s.notes || '—'}</td>
                              <td className="text-right font-mono">{s.ticket}</td>
                              <td className="text-right font-mono">{s.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}

                    {activeTab === 'Ticket' && ticketAggregates.map((item) => (
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
                <div className="text-xs font-bold uppercase tracking-widest text-primary/70">Total Summary</div>
                <div className="text-xl font-mono font-bold text-primary">
                  { (activeTab === 'History' 
                      ? groupedSales.reduce((acc, [_, g]) => acc + g.reduce((s, x) => s + x.amount, 0), 0)
                      : totals
                    ).toLocaleString() }
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Sale Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="text-primary" size={20} />
              <span>Record Sale: <span className="text-primary">{selectedAgent?.name}</span></span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Entry Panel</Label>
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
                placeholder="Optional administrative notes..." 
                className="bg-background/40 h-10"
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>
            <Button className="w-full btn-primary-gradient h-12 text-lg" onClick={handleSubmit}>
              Authenticate & Commit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPage;
