import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { callPython } from '../utils/bridge';
import { ChevronDown, ChevronRight, TrendingUp, Plus } from 'lucide-react';

const SalesPage = () => {
  const [agents, setAgents] = useState([]);
  const [sales, setSales] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState('');
  
  const [activeTab, setActiveTab] = useState('History');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = async () => {
    const drawsData = await callPython('get_draws');
    const agentsData = await callPython('get_agents');
    const salesData = await callPython('get_sales');
    const openDraw = drawsData.find(d => d.status === 'Open');
    setDraws(drawsData.filter(d => d.status === 'Open'));
    setAgents(agentsData);
    setSelectedDraw(openDraw);
    setSales(salesData.filter(s => s.draw_id === openDraw?.id));
  };

  useEffect(() => { fetchData(); }, []);

  const ticketSummary = useMemo(() => {
    const summary = {};
    sales.forEach(s => {
      if (!summary[s.ticket]) summary[s.ticket] = 0;
      summary[s.ticket] += s.amount;
    });
    return Object.entries(summary).sort((a, b) => b[1] - a[1]);
  }, [sales]);

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

  const handleSubmit = async () => {
    if (!selectedDraw || !agentId) return alert('Select Draw and Agent');
    await callPython('create_sales', {
      draw_id: selectedDraw.id,
      agent_id: agentId,
      input_text: inputText,
      notes: notes
    });
    setInputText(''); setNotes(''); setIsDialogOpen(false);
    await fetchData();
  };

  const tabs = ['History', 'Ticket', 'Taken', 'Offloaded', 'Pending'];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <div className="flex-none p-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Sales Dashboard: {selectedDraw?.draw_date || 'No Open Draw'}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary-gradient"><Plus className="mr-2 h-4 w-4" /> Add Sale</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>New Sale Record</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Agent</Label>
                  <Select onValueChange={setAgentId}>
                    <SelectTrigger><SelectValue placeholder="Select Agent" /></SelectTrigger>
                    <SelectContent>
                      {agents.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tickets (TICKET = AMOUNT)</Label>
                  <Textarea placeholder="123 = 5000" rows={8} value={inputText} onChange={(e) => setInputText(e.target.value)} />
                </div>
                <Textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <Button className="w-full btn-primary-gradient" onClick={handleSubmit}>Submit Sale</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex border-b border-border mb-6">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`px-6 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {activeTab === 'History' && (
          <Card className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 w-10"></th><th className="pb-2">Time</th><th className="pb-2">Agent</th><th className="pb-2 text-right">Tickets</th><th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGroups.map(([timestamp, group]) => {
                  const isExpanded = expandedGroups[timestamp];
                  const totalAmount = group.reduce((sum, s) => sum + s.amount, 0);
                  return (
                    <React.Fragment key={timestamp}>
                      <tr className="border-b border-border/50 hover:bg-muted/50 cursor-pointer" onClick={() => setExpandedGroups({...expandedGroups, [timestamp]: !isExpanded})}>
                        <td className="py-3">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</td>
                        <td className="py-3">{new Date(timestamp).toLocaleTimeString()}</td>
                        <td className="py-3">{group[0].agent_name}</td>
                        <td className="py-3 text-right">{group.length}</td>
                        <td className="py-3 text-right font-mono">{totalAmount}</td>
                      </tr>
                      {isExpanded && group.map(s => (
                        <tr key={s.id} className="bg-muted/30">
                          <td /><td /><td /><td className="py-2 text-right font-mono text-sm">{s.ticket}</td><td className="py-2 text-right font-mono text-sm">{s.amount}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            {groupedSales.length > itemsPerPage && (
              <div className="mt-4 flex gap-2 justify-end">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
                <Button disabled={currentPage * itemsPerPage >= groupedSales.length} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'Ticket' && (
          <Card className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border"><th className="pb-2">Ticket</th><th className="pb-2 text-right">Total Amount</th></tr>
              </thead>
              <tbody>
                {ticketSummary.map(([ticket, amount]) => (
                  <tr key={ticket} className="border-b border-border/50"><td className="py-2 font-mono">{ticket}</td><td className="py-2 text-right font-mono">{amount}</td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
