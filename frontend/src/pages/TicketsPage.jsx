import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { callPython } from '../utils/bridge';

const TicketsPage = () => {
  const [sales, setSales] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);

  const fetchData = async () => {
    const drawsData = await callPython('get_draws');
    const salesData = await callPython('get_sales');
    const openDraw = drawsData.find(d => d.status === 'Open');
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Ticket Summary: {selectedDraw?.draw_date}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ticket Summary */}
        <Card className="p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Ticket Totals</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-2">Ticket</th>
                <th className="pb-2 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {ticketSummary.map(([ticket, amount]) => (
                <tr key={ticket} className="border-b border-border/50">
                  <td className="py-2 font-mono">{ticket}</td>
                  <td className="py-2 text-right font-mono">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        
        {/* Placeholder Detail Table */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            Select a ticket to view detailed records
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TicketsPage;
