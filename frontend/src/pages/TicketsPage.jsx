/* TicketsPage — Two-Column Ticket Summary */
/* ──────────────────────────────────────── */
/* Left: Ticket totals table              */
/* Right: Ticket detail placeholder       */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { callPython } from '../utils/bridge';
import { TrendingUp, Ticket } from 'lucide-react';

const TicketsPage = () => {
  const [sales, setSales] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);

  const fetchData = async () => {
    const drawsData = await callPython('get_draws');
    const salesData = await callPython('get_sales');
    setDraws(drawsData);
    const openDraw = drawsData.find(d => d.status === 'Open');
    setSelectedDraw(openDraw || (drawsData.length > 0 ? drawsData[0] : null));
    setSales(salesData);
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
    return Object.entries(summary).sort((a, b) => b[1] - a[1]);
  }, [filteredSales]);

  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + (s.amount || 0), 0);
  }, [filteredSales]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient mb-1 flex items-center gap-3">
            <Ticket className="h-7 w-7" />
            Ticket Summary
          </h1>
          <p className="text-sm text-muted-foreground">
            Draw: {selectedDraw?.draw_date || '—'} &middot; Total Revenue: ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 text-sm">
            <span className="text-muted-foreground">Tickets Sold: </span>
            <span className="font-bold text-gradient">{filteredSales.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Ticket Totals ── */}
        <Card className="corner-accent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ticket Totals
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">{ticketSummary.length} tickets</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th className="text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketSummary.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-muted-foreground text-sm">
                        No ticket data available for this draw.
                      </td>
                    </tr>
                  ) : (
                    ticketSummary.map(([ticket, amount]) => (
                      <tr key={ticket} className="cursor-pointer hover:bg-accent/5 transition-colors duration-150">
                        <td className="py-3 font-bold font-mono">{ticket}</td>
                        <td className="py-3 text-right font-bold font-mono">${amount.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ── Detail Placeholder ── */}
        <Card className="corner-accent">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Ticket Details
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-none">
            <div className="text-center">
              <Ticket className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm">Select a ticket to view detailed records</p>
              <p className="text-[11px] text-muted-foreground/70 mt-1">Click any row in the ticket totals table</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketsPage;