import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { callPython } from '../utils/bridge';
import { 
  ArrowUpRight, 
  ShieldAlert,
  History,
  Printer,
  FileText,
  AlertCircle
} from 'lucide-react';

const OffloadPage = () => {
  const [offloads, setOffloads] = useState([]);
  const [sales, setSales] = useState([]);
  const [draws, setDraws] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedDealerId, setSelectedDealerId] = useState('');
  
  // Persistent Settings
  const [adminHold, setAdminHold] = useState(5000);
  const [maxOffloadAmount, setMaxOffloadAmount] = useState(10000);
  const [maxOffloadTicket, setMaxOffloadTicket] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  
  // UI State
  const [leftTab, setLeftTab] = useState('Pending'); // Holding, Offloaded, Pending
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = async () => {
    try {
      const drawsData = await callPython('get_draws');
      const offloadsData = await callPython('get_offloads');
      const salesData = await callPython('get_sales');
      const dealersData = await callPython('get_master_dealers');
      
      const hold = await callPython('get_setting', 'admin_hold', '5000');
      const maxAmt = await callPython('get_setting', 'max_offload_amount', '10000');
      const maxTkt = await callPython('get_setting', 'max_offload_ticket', '10');
      const pgNum = await callPython('get_setting', 'offload_page_number', '1');
      
      const openDraw = drawsData.find(d => d.status === 'Open');
      setDraws(drawsData.filter(d => d.status === 'Open'));
      setSelectedDraw(openDraw);
      setDealers(dealersData);
      if (dealersData.length > 0 && !selectedDealerId) setSelectedDealerId(dealersData[0].id);
      
      setOffloads(offloadsData.filter(o => o.draw_id === openDraw?.id));
      setSales(salesData.filter(s => s.draw_id === openDraw?.id));
      
      setAdminHold(Number(hold));
      setMaxOffloadAmount(Number(maxAmt));
      setMaxOffloadTicket(Number(maxTkt));
      setPageNumber(Number(pgNum));
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
    
    // Map internal key to DB key
    const dbKey = key === 'page_number' ? 'offload_page_number' : key;
    if (key === 'page_number') setPageNumber(numVal);
    
    await callPython('update_setting', dbKey, numVal);
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
    }).sort((a, b) => b.pending - a.pending); // Sort by most pending liability
  }, [sales, offloads, adminHold]);

  const leftTableData = useMemo(() => {
    if (leftTab === 'Holding') return riskAggregates.filter(i => i.holding > 0);
    if (leftTab === 'Offloaded') return riskAggregates.filter(i => i.offloaded > 0);
    if (leftTab === 'Pending') return riskAggregates.filter(i => i.pending > 0);
    return [];
  }, [riskAggregates, leftTab]);

  const pendingTickets = useMemo(() => riskAggregates.filter(i => i.pending > 0), [riskAggregates]);

  // Template Data: Always preview the next batch of pending tickets
  const templateBatch = useMemo(() => {
    return pendingTickets.slice(0, maxOffloadTicket).map(t => ({
      ticket: t.ticket,
      amount: t.pending > maxOffloadAmount ? maxOffloadAmount : t.pending,
      originalPending: t.pending
    }));
  }, [pendingTickets, maxOffloadTicket, maxOffloadAmount]);

  const handlePerformOffload = async () => {
    if (templateBatch.length === 0 || !selectedDealerId || !selectedDraw) return;
    
    setIsLoading(true);
    try {
      // Convert batch to the string format expected by create_offload
      const inputText = templateBatch.map(b => `${b.ticket} = ${b.amount}`).join('\n');
      
      await callPython('create_offload', {
        draw_id: selectedDraw.id,
        master_dealer_id: selectedDealerId,
        input_text: inputText,
        notes: `Offload Page ${pageNumber}`
      });
      
      // Increment page number
      const nextPg = pageNumber + 1;
      await handleSettingChange('page_number', nextPg);
      
      await fetchData();
    } catch (error) {
      console.error('Offload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Template Data Slicing (4 columns of 15)
  const templateGrid = useMemo(() => {
    const grid = [[], [], [], []];
    templateBatch.forEach((item, idx) => {
      const colIdx = Math.floor(idx / 15);
      if (colIdx < 4) {
        grid[colIdx].push(item);
      }
    });
    return grid;
  }, [templateBatch]);

  const batchTotal = useMemo(() => templateBatch.reduce((sum, item) => sum + item.amount, 0), [templateBatch]);

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Header - Settings & Master Dealer Selection */}
      <header className="flex-none p-4 glass-navbar border-b border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Master Dealer</Label>
            <Select value={selectedDealerId} onValueChange={setSelectedDealerId}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Select Dealer" />
              </SelectTrigger>
              <SelectContent>
                {dealers.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Hold Amt</Label>
              <Input 
                type="number" 
                value={adminHold} 
                onChange={(e) => handleSettingChange('admin_hold', e.target.value)}
                className="h-9 w-24 bg-background/40 font-mono text-[13px] font-bold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Max Offload</Label>
              <Input 
                type="number" 
                value={maxOffloadAmount} 
                onChange={(e) => handleSettingChange('max_offload_amount', e.target.value)}
                className="h-9 w-24 bg-background/40 font-mono text-[13px] font-bold text-cyan-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Max Tickets</Label>
              <Input 
                type="number" 
                value={maxOffloadTicket} 
                onChange={(e) => handleSettingChange('max_offload_ticket', e.target.value)}
                className="h-9 w-20 bg-background/40 font-mono text-[13px] font-bold text-amber-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handlePerformOffload}
            disabled={templateBatch.length === 0 || isLoading || !selectedDealerId}
            className="btn-primary-gradient h-9 px-6 text-[11px] uppercase font-black tracking-widest group"
          >
            <ArrowUpRight className="mr-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            {isLoading ? 'Processing...' : 'Perform Offload'}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* SIDEBAR: Data Tables (Narrow) */}
        <aside className="w-80 flex-none border-r border-white/5 flex flex-col overflow-hidden bg-black/20">
          <div className="flex-none p-1 border-b border-white/5 bg-white/5 flex gap-1">
            {['Holding', 'Offloaded', 'Pending'].map(tab => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`flex-1 py-2.5 text-[9px] uppercase font-black tracking-widest transition-all relative ${
                  leftTab === tab ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {leftTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary glow-sm" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-white/5">
                <tr>
                  <th className="p-2 text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider pl-4">Ticket</th>
                  <th className="p-2 text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider text-right pr-4">
                    {leftTab === 'Holding' ? 'Held' : leftTab === 'Offloaded' ? 'Offloaded' : 'Pending'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {leftTableData.length > 0 ? (
                  leftTableData.map((item) => (
                    <tr key={item.ticket} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-2 py-2.5 font-mono text-xs font-bold tracking-widest pl-4 group-hover:text-primary transition-colors">{item.ticket}</td>
                      <td className="p-2 py-2.5 text-right font-mono text-xs font-bold text-primary pr-4">
                        {(leftTab === 'Holding' ? item.holding : leftTab === 'Offloaded' ? item.offloaded : item.pending).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-20">
                        <AlertCircle size={24} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">No {leftTab} Data</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex-none p-4 bg-primary/5 border-t border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Total {leftTab}</span>
              <span className="text-sm font-mono font-bold text-primary">
                {leftTableData.reduce((sum, t) => sum + (leftTab === 'Holding' ? t.holding : leftTab === 'Offloaded' ? t.offloaded : t.pending), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT: Template Preview (Wide) */}
        <main className="flex-1 bg-black/40 p-6 overflow-y-auto scrollbar-thin flex flex-col items-center">
          {templateBatch.length > 0 ? (
            <div className="w-full max-w-5xl bg-white text-black p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[700px]">
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
              
              {/* Template Header */}
              <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tighter italic">KALAW</h1>
                  <p className="text-[10px] font-bold tracking-widest opacity-60">VANGUARD RISK OFFLOAD SYSTEM</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Draw Date</p>
                  <p className="text-xl font-black font-mono">{selectedDraw?.draw_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Page</p>
                  <p className="text-3xl font-black font-mono leading-none">{pageNumber}</p>
                </div>
              </div>

              {/* Template Body: 4 Columns of 15 */}
              <div className="flex-1 grid grid-cols-4 gap-8">
                {templateGrid.map((column, colIdx) => (
                  <div key={colIdx} className="flex flex-col">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-black/10 border-t border-b border-black/20">
                        {/* Ensure exactly 15 rows for visual consistency */}
                        {Array.from({ length: 15 }).map((_, rowIdx) => {
                          const item = column[rowIdx];
                          return (
                            <tr key={rowIdx} className="h-7">
                              <td className="w-1/2 font-mono text-[13px] font-bold border-r border-black/5 pl-1">
                                {item?.ticket || ''}
                              </td>
                              <td className="w-1/2 text-right font-mono text-[13px] font-bold pr-1">
                                {item ? item.amount.toLocaleString() : ''}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="mt-2 pt-2 border-t-2 border-black flex justify-between items-center px-1">
                      <span className="text-[9px] font-bold uppercase">Subtotal</span>
                      <span className="font-mono text-[12px] font-black">
                        {column.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Template Footer */}
              <div className="mt-8 pt-6 border-t-4 border-black flex justify-end">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Amount Offloaded</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold uppercase">Totally -</span>
                    <span className="text-3xl font-black font-mono italic underline decoration-2 underline-offset-4">
                      {batchTotal.toLocaleString()}
                    </span>
                    <span className="text-xl font-black italic">Ks</span>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Marks */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black" />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md opacity-30 select-none">
              <FileText size={64} strokeWidth={1} className="mb-6" />
              <h3 className="text-lg font-black uppercase tracking-tighter mb-2">No Pending Risk</h3>
              <p className="text-xs font-bold leading-relaxed uppercase tracking-widest">
                All sales are within holding limits or have already been offloaded for this draw.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OffloadPage;
