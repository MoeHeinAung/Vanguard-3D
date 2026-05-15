/* TicketsPage — High-Fidelity Ticket Command Center */
/* ──────────────────────────────────────────────── */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callPython } from '../utils/bridge';
import { Ticket, TrendingUp, Search, Info, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const TicketsPage = () => {
  const [sales, setSales] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const drawsData = await callPython('get_draws');
      const salesData = await callPython('get_sales');
      setDraws(drawsData || []);
      const openDraw = drawsData?.find(d => d.status === 'Open');
      setSelectedDraw(openDraw || (drawsData?.[0] || null));
      setSales(salesData || []);
    } catch (error) {
      console.error("Failed to fetch ticket data:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredSales = useMemo(() => {
    if (!selectedDraw) return [];
    return sales.filter(s => s.draw_id === selectedDraw.id);
  }, [sales, selectedDraw]);

  const ticketSummary = useMemo(() => {
    const summary = {};
    filteredSales.forEach(s => {
      if (!summary[s.ticket]) summary[s.ticket] = 0;
      summary[s.ticket] += s.amount;
    });

    return Object.entries(summary)
      .filter(([ticket]) => ticket.includes(searchTerm))
      .sort((a, b) => b[1] - a[1]);
  }, [filteredSales, searchTerm]);

  const ticketDetails = useMemo(() => {
    if (!selectedTicket) return [];
    return filteredSales.filter(s => s.ticket === selectedTicket);
  }, [filteredSales, selectedTicket]);

  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + (s.amount || 0), 0);
  }, [filteredSales]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* ── Page Header ── */}
      <header className="flex-none h-20 border-b border-border/40 bg-obsidian-900/50 backdrop-blur-md px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="h1-display text-gradient flex items-center gap-3">
              <Ticket className="h-6 w-6 text-cyan-400" />
              TICKET SUMMARY
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">
              Aggregate Revenue Analysis &middot; {selectedDraw?.draw_date || 'NO ACTIVE DRAW'}
            </p>
          </div>
          <div className="h-8 w-[1px] bg-border/40 mx-2" />
          <div className="flex gap-8">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Total Revenue</p>
              <p className="data-lg text-cyan-400">${totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Unique Tickets</p>
              <p className="data-lg text-violet-400">{Object.keys(ticketSummary).length}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="FILTER TICKETS..."
              className="bg-obsidian-800/50 border border-border/40 rounded-none pl-9 pr-4 py-2 text-[11px] uppercase tracking-wider focus:outline-none focus:border-cyan-500/50 transition-colors w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="badge-elegant bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            LIVE FEED
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Ticket Totals (Master) ── */}
        <section className="w-1/3 flex-none flex flex-col border-r border-border/40 bg-obsidian-950/20">
          <div className="flex-none p-6 pb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-cyan-500" />
              Top Performing Tickets
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-6">
            <div className="space-y-1">
              {ticketSummary.length === 0 ? (
                <div className="py-12 text-center">
                  <Info className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 uppercase tracking-widest">No matching tickets</p>
                </div>
              ) : (
                ticketSummary.map(([ticket, amount]) => (
                  <div
                    key={ticket}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "group relative p-4 border border-border/20 cursor-pointer transition-all duration-200",
                      selectedTicket === ticket
                        ? "bg-cyan-500/5 border-cyan-500/40"
                        : "hover:bg-white/5 hover:border-border/40"
                    )}
                  >
                    {selectedTicket === ticket && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">Ticket ID</p>
                        <p className="font-mono text-lg font-bold text-slate-200">{ticket}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Revenue</p>
                        <p className="font-mono text-lg font-bold text-cyan-400">${amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── Ticket Details (Detail) ── */}
        <section className="flex-1 flex flex-col bg-obsidian-900/10 relative">
          {selectedTicket ? (
            <>
              <div className="flex-none p-8 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 border border-cyan-500/20">AUDIT LOG</span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-200">RECORDS FOR TICKET #{selectedTicket}</h2>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Historical sales distribution for this specific entry</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Aggregate Count</p>
                  <p className="data-lg text-slate-200">{ticketDetails.length} Sales</p>
                </div>
              </div>

              <div className="flex-1 overflow-hidden px-8 pb-8">
                <div className="h-full border border-border/40 flex flex-col overflow-hidden bg-obsidian-950/40">
                  <table className="data-table w-full">
                    <thead className="sticky top-0 z-20">
                      <tr>
                        <th>TRANSACTION ID</th>
                        <th>AGENT / NODE</th>
                        <th className="text-right">AMOUNT</th>
                        <th className="text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="scrollbar-thin">
                      {ticketDetails.map((s, idx) => (
                        <tr key={idx} className="hover:bg-white/5 group">
                          <td className="font-mono text-xs text-slate-400">TXN-{s.id.toString().padStart(6, '0')}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
                              <span className="font-bold text-slate-300">{s.agent_name || 'EXTERNAL AGENT'}</span>
                            </div>
                          </td>
                          <td className="text-right font-mono text-cyan-400 font-bold">${s.amount.toLocaleString()}</td>
                          <td className="text-right">
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center justify-end gap-1">
                              VERIFIED <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-obsidian-800/50 flex items-center justify-center mb-6 border border-border/40">
                <Ticket className="h-10 w-10 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-300 uppercase tracking-widest mb-2">Selection Required</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Select a ticket from the sidebar to view its complete transaction history and revenue distribution.
              </p>
            </div>
          )}

          {/* Decorative Corner */}
          <div className="absolute bottom-0 right-0 p-8 pointer-events-none opacity-20">
            <Ticket className="h-48 w-48 text-slate-700 rotate-12" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TicketsPage;