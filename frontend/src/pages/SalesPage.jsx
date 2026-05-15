import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { callPython } from '../utils/bridge';
import { ChevronRight, ChevronDown } from 'lucide-react';

const SalesPage = () => {
  const [agents, setAgents] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = async () => {
    const drawsData = await callPython('get_draws');
    const agentsData = await callPython('get_agents');
    const salesData = await callPython('get_sales');
    const openDraw = drawsData.find(d => d.status === 'Open');
    setAgents(agentsData);
    setSelectedDraw(openDraw);
    setSales(salesData.filter(s => s.draw_id === openDraw?.id));
  };

  useEffect(() => { fetchData(); }, []);

  const groupedSales = useMemo(() => {
    const groups = {};
    sales.forEach(s => {
      if (!groups[s.created_at]) groups[s.created_at] = [];
      groups[s.created_at].push(s);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [sales]);

  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return groupedSales.slice(start, start + itemsPerPage);
  }, [groupedSales, currentPage]);

  const handleSubmit = async () => {
    if (!selectedDraw || !selectedAgent) return alert('Select Agent');
    await callPython('create_sales', {
      draw_id: selectedDraw.id,
      agent_id: selectedAgent.id,
      input_text: inputText,
      notes: notes
    });
    setInputText(''); setNotes(''); setSelectedAgent(null);
    await fetchData();
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Sales Dashboard: {selectedDraw?.draw_date}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 md:col-span-1">
          <Label className="mb-4 block">Select Agent</Label>
          <div className="space-y-2">
            {agents.map(a => (
              <Dialog key={a.id}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start hover:bg-primary/10" onClick={() => setSelectedAgent(a)}>
                    {a.name}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Record Sale for {a.name}</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Textarea placeholder="123 = 5000" rows={8} value={inputText} onChange={(e) => setInputText(e.target.value)} />
                    <Button className="w-full btn-primary-gradient" onClick={handleSubmit}>Submit Sale</Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </Card>
        
        <Card className="p-6 md:col-span-3 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-2 w-10"></th>
                <th className="pb-2">Time</th>
                <th className="pb-2">Agent</th>
                <th className="pb-2 text-right">Tickets</th>
                <th className="pb-2 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGroups.map(([timestamp, group]) => {
                const isExpanded = expandedGroups[timestamp];
                const totalAmount = group.reduce((sum, s) => sum + s.amount, 0);
                return (
                  <>
                    <tr className="border-b border-border/50 hover:bg-muted/50 cursor-pointer" onClick={() => setExpandedGroups({...expandedGroups, [timestamp]: !isExpanded})}>
                      <td className="py-3">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</td>
                      <td className="py-3">{new Date(timestamp).toLocaleTimeString()}</td>
                      <td className="py-3">{group[0].agent_name}</td>
                      <td className="py-3 text-right">{group.length}</td>
                      <td className="py-3 text-right font-mono">{totalAmount}</td>
                    </tr>
                    {isExpanded && group.map(s => (
                      <tr key={s.id} className="bg-muted/30">
                        <td /> <td /> <td />
                        <td className="py-2 text-right font-mono text-sm">{s.ticket}</td>
                        <td className="py-2 text-right font-mono text-sm">{s.amount}</td>
                      </tr>
                    ))}
                  </>
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
      </div>
    </div>
  );
};

export default SalesPage;
