/* SalesPage — Two-Column Master-Detail Layout */
/* ───────────────────────────────────────────── */
/* Left:  Draw selection, Agent selection        */
/* Right: Multi-line input + submission history  */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { callPython } from '../utils/bridge';
import { ChevronDown, ChevronRight, TrendingUp } from 'lucide-react';

const SalesPage = () => {
  const [agents, setAgents] = useState([]);
  const [sales, setSales] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ totalTickets: 0, totalAmount: 0 });
  const itemsPerPage = 20;

  const fetchData = async () => {
    const drawsData = await callPython('get_draws');
    const agentsData = await callPython('get_agents');
    const salesData = await callPython('get_sales');
    setDraws(drawsData);
    setAgents(agentsData);

    const openDraw = drawsData.find(d => d.status === 'Open');
    setSelectedDraw(openDraw || (drawsData.length > 0 ? drawsData[0] : null));

    const filtered = salesData.filter(s => s.draw_id === (openDraw || drawsData[0] || {}).id);
    setSales(filtered);

    // Compute summary stats
    const totalTickets = filtered.length;
    const totalAmount = filtered.reduce((sum, s) => sum + (s.amount || 0), 0);
    setStats({ totalTickets, totalAmount });
  };

  useEffect(() => { fetchData(); }, []);

  const groupedSales = useMemo(() => {
    const groups = {};
    sales.forEach(s => {
      const key = s.created_at || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [sales]);

  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return groupedSales.slice(start, start + itemsPerPage);
  }, [groupedSales, currentPage]);

  const handleDrawChange = (draw) => {
    setSelectedDraw(draw);
    setSales([]);
    setCurrentPage(1);
    if (draw) {
      callPython('get_sales').then(allSales => {
        const filtered = allSales.filter(s => s.draw_id === draw.id);
        setSales(filtered);
        const totalAmount = filtered.reduce((sum, s) => sum + (s.amount || 0), 0);
        setStats({ totalTickets: filtered.length, totalAmount });
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedDraw || !selectedAgent) {
      alert('Please select both a Draw and an Agent before submitting.');
      return;
    }
    await callPython('create_sales', {
      draw_id: selectedDraw.id,
      agent_id: selectedAgent.id,
      input_text: inputText,
      notes: notes
    });
    setInputText('');
    setNotes('');
    setSelectedAgent(null);
    await fetchData();
  };

  const clearSelection = () => {
    setInputText('');
    setNotes('');
    setSelectedAgent(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient mb-1">
            <TrendingUp className="inline mr-3 h-7 w-7" />
            Sales Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Draw: {selectedDraw?.draw_date || '—'} &middot; Cutoff: {selectedDraw?.cutoff_time || '—'} &middot; Status: {selectedDraw?.status || '—'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={clearSelection}>
            Clear
          </Button>
          <Button className="btn-primary-gradient" size="lg" onClick={handleSubmit}>
            Submit Sales
          </Button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Draw</p>
          <p className="text-lg font-bold">{selectedDraw?.draw_date || '—'}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
          <p className="text-lg font-bold capitalize">{selectedDraw?.status || '—'}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total Tickets</p>
          <p className="text-2xl font-bold text-gradient">{stats.totalTickets}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total Amount</p>
          <p className="text-2xl font-bold font-mono">${stats.totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left Column: Draw & Agent Selectors ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Draw Selection */}
          <Card className="corner-accent">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Draws</CardTitle>
              <span className="text-[10px] text-muted-foreground">{draws.length} records</span>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                {draws.map((draw) => (
                  <button
                    key={draw.id}
                    onClick={() => handleDrawChange(draw)}
                    className={`w-full text-left px-4 py-3 border-b border-border/30 transition-colors duration-150 ${
                      selectedDraw?.id === draw.id
                        ? 'bg-accent/10 border-l-2 border-l-primary shadow-inner'
                        : 'hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{draw.draw_date}</p>
                      <span className={`badge-elegant badge-elegant-${
                        draw.status === 'Open' ? 'success' :
                        draw.status === 'Closed' ? 'warning' : 'info'
                      }`}>
                        {draw.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Cutoff: {draw.cutoff_time}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Selection */}
          <Card className="corner-accent">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Agent</CardTitle>
              <span className="text-[10px] text-muted-foreground">{agents.length} records</span>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left px-4 py-3 border-b border-border/30 transition-colors duration-150 ${
                      selectedAgent?.id === agent.id
                        ? 'bg-accent/10 border-l-2 border-l-primary shadow-inner'
                        : 'hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{agent.name}</p>
                      <span className="text-[10px] text-muted-foreground">{agent.id}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Comm: {agent.commission}% &middot; JP: {agent.jp_factor} &middot; SP: {agent.sp_factor}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Agent Quick Info */}
          {selectedAgent && (
            <Card className="border border-primary/20 bg-primary/5 corner-accent">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center bg-surface-container text-primary font-bold text-sm">
                    {selectedAgent.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{selectedAgent.name}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedAgent.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="p-2 bg-surface-container/50 rounded-none border border-border/30 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">Comm</p>
                    <p className="text-sm font-bold">{selectedAgent.commission}%</p>
                  </div>
                  <div className="p-2 bg-surface-container/50 rounded-none border border-border/30 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">JP</p>
                    <p className="text-sm font-bold">{selectedAgent.jp_factor}</p>
                  </div>
                  <div className="p-2 bg-surface-container/50 rounded-none border border-border/30 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">SP</p>
                    <p className="text-sm font-bold">{selectedAgent.sp_factor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right Column: Input + Sales History ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Input */}
          <Card className="corner-accent">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider">
                Record Sales &mdash; {selectedAgent ? selectedAgent.name : 'No Agent Selected'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ticket Input</Label>
                <Textarea
                  placeholder="Enter one per line&#10;Format: TICKET = AMOUNT&#10;&#10;Example:&#124;123 = 5000&#10;456 = 10000&#10;789 = 2500"
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="font-mono"
                />
                <p className="text-[10px] text-muted-foreground text-right">
                  {inputText.split('\n').filter(l => l.trim()).length || 0} lines entered
                </p>
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Administrative notes for this batch..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button
                className="btn-primary-gradient w-full"
                disabled={!selectedAgent || !inputText.trim() || !selectedDraw}
                onClick={handleSubmit}
              >
                Submit Sales
              </Button>
            </CardContent>
          </Card>

          {/* Sales History */}
          <Card className="corner-accent">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Sales History</CardTitle>
              <span className="text-[10px] text-muted-foreground">
                {sales.length} total &middot; Showing {Math.min(paginatedGroups.length * itemsPerPage, sales.length)}
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="w-6"></th>
                    <th>Time</th>
                    <th>Agent</th>
                    <th className="text-right">Tickets</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {paginatedGroups.map(([timestamp, group]) => {
                    const isExpanded = expandedGroups[timestamp];
                    const totalAmount = group.reduce((sum, s) => sum + (s.amount || 0), 0);
                    return (
                      <React.Fragment key={timestamp}>
                        <tr
                          className="cursor-pointer hover:bg-accent/5 transition-colors duration-150"
                          onClick={() => setExpandedGroups({ ...expandedGroups, [timestamp]: !isExpanded })}
                        >
                          <td className="py-3 pr-2">
                            {isExpanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                          </td>
                          <td className="py-3 text-sm">{new Date(timestamp).toLocaleTimeString()}</td>
                          <td className="py-3 text-sm">{group[0]?.agent_name}</td>
                          <td className="py-3 text-right text-sm">{group.length}</td>
                          <td className="py-3 text-right text-sm font-bold">${totalAmount.toLocaleString()}</td>
                        </tr>
                        {isExpanded && group.map((s) => (
                          <tr key={s.id} className="bg-surface-container/30">
                            <td />
                            <td />
                            <td />
                            <td className="py-2 text-right text-xs font-mono">{s.ticket}</td>
                            <td className="py-2 text-right text-xs font-mono">${s.amount}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {groupedSales.length > itemsPerPage && (
                <div className="flex items-center justify-end gap-2 p-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Prev
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {currentPage} of {Math.ceil(groupedSales.length / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage * itemsPerPage >= groupedSales.length}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;