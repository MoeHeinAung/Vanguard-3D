import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { callPython } from '../utils/bridge';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Layers, 
  Shield, 
  ArrowLeft, 
  Download,
  AlertCircle,
  Trophy,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ReportPage = ({ drawId, onBack }) => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('house'); // house, agents, dealers
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      let targetId = drawId;
      
      if (!targetId) {
        const draws = await callPython('get_draws');
        const latestSettled = draws.find(d => d.status === 'Settled') || draws[0];
        if (latestSettled) targetId = latestSettled.id;
      }

      if (targetId) {
        const result = await callPython('calculate_settlement', targetId);
        if (result.status === 'success') {
          setData(result);
        }
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [drawId]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Compiling Settlement Data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="glass-card p-12 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-200 mb-2">Report Initialization Failed</h3>
          <p className="text-sm text-muted-foreground mb-6">Unable to generate settlement metrics for the requested draw session.</p>
          <Button onClick={onBack} variant="outline" className="w-full">Return to Management</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Page Header */}
      <header className="flex-none h-20 border-b border-border/40 bg-obsidian-900/50 backdrop-blur-md px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="hover:bg-white/5 rounded-none border border-border/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-gradient uppercase tracking-widest flex items-center gap-3">
              <PieChart className="h-5 w-5 text-cyan-400" />
              Settlement Report
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
              Analysis Core &middot; {data.draw.draw_date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-obsidian-800/40 border border-border/40 rounded-none">
            {[
              { id: 'house', label: 'House', icon: Shield },
              { id: 'agents', label: 'Agents', icon: Users },
              { id: 'dealers', label: 'Dealers', icon: Layers }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === tab.id 
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]" 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2 rounded-none border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-page-fade">
          
          {activeTab === 'house' && <HouseView report={data.house} />}
          {activeTab === 'agents' && <AgentsView reports={data.agents} />}
          {activeTab === 'dealers' && <DealersView reports={data.master_dealers} />}

        </div>
      </main>
    </div>
  );
};

const HouseView = ({ report }) => {
  return (
    <div className="space-y-8">
      {/* High Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Gross Sales" value={report.sales} variant="cyan" />
        <StatCard label="Agent Commissions" value={report.agent_commission} variant="slate" />
        <StatCard label="Total Payouts" value={report.agent_payouts} variant="amber" />
        <StatCard label="Net Profit" value={report.net} variant="emerald" glow />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Card className="glass-card border-border/20">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest text-slate-400">Risk Mitigation Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-end border-b border-border/20 pb-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Offloaded Value</p>
                <p className="text-2xl font-mono font-bold text-slate-200">{report.offload.toLocaleString()} Ks</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">MD Commissions</p>
                <p className="text-xl font-mono font-bold text-slate-400">-{report.md_commission.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">MD Winning Liabilities Recovered</span>
              <span className="text-lg font-mono font-bold text-emerald-400">+{report.md_payouts.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-border/40 flex justify-between items-center">
              <span className="text-sm font-black uppercase tracking-wider text-cyan-400">Net Offload Recovery</span>
              <span className="text-2xl font-mono font-bold text-cyan-400">
                {(report.offload - report.md_commission - report.md_payouts).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <div className="p-8 bg-slate-900/40 border border-border/20 flex flex-col justify-center">
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 mb-4">Settlement Efficiency</p>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-mono font-black text-gradient">
                  {report.sales > 0 ? ((report.net / report.sales) * 100).toFixed(1) : 0}%
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Profit Margin</span>
              </div>
           </div>
           <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-wide font-medium italic">
             This report accounts for all validated sales, registered winning tickets, and applicable factor multipliers across the entire node network.
           </p>
        </div>
      </div>
    </div>
  );
};

const AgentsView = ({ reports }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Agent Performance Node Map</h3>
        <span className="text-[10px] font-bold text-slate-600">{reports.length} Nodes Active</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {reports.map(agent => (
          <Card key={agent.id} className="glass-card hover:border-border/60 transition-colors border-border/20 overflow-hidden">
            <div className="grid grid-cols-6 items-center">
              <div className="col-span-2 p-6 border-r border-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{agent.name}</h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">{agent.id}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-r border-border/20 text-center">
                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Sales</p>
                <p className="font-mono font-bold text-slate-300">{agent.sales.toLocaleString()}</p>
              </div>
              <div className="p-6 border-r border-border/20 text-center">
                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Commission</p>
                <p className="font-mono font-bold text-slate-400">{agent.commission.toLocaleString()}</p>
              </div>
              <div className="p-6 border-r border-border/20 text-center">
                <p className="text-[9px] uppercase font-bold text-amber-500/70 mb-1">Payout</p>
                <p className="font-mono font-bold text-amber-400">{agent.payout.toLocaleString()}</p>
              </div>
              <div className={cn("p-6 text-right pr-8 bg-black/20", agent.net >= 0 ? "text-emerald-400" : "text-destructive")}>
                <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Net Balance</p>
                <p className="text-xl font-mono font-black">{agent.net.toLocaleString()}</p>
              </div>
            </div>
            {agent.winners.length > 0 && (
              <div className="px-6 py-3 bg-white/5 border-t border-border/20 flex gap-4 overflow-x-auto scrollbar-none">
                {agent.winners.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                    <Trophy className="h-3 w-3 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {w.ticket} <span className="mx-1 text-slate-600">→</span> 
                      <span className="text-amber-400">{w.payout.toLocaleString()}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

const DealersView = ({ reports }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Master Dealer Liability Matrix</h3>
        <span className="text-[10px] font-bold text-slate-600">{reports.length} Entities Active</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {reports.map(dealer => (
          <Card key={dealer.id} className="glass-card border-border/20 overflow-hidden">
            <div className="grid grid-cols-6 items-center">
              <div className="col-span-2 p-6 border-r border-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{dealer.name}</h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">{dealer.id}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-r border-border/20 text-center">
                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Offloaded</p>
                <p className="font-mono font-bold text-slate-300">{dealer.offload.toLocaleString()}</p>
              </div>
              <div className="p-6 border-r border-border/20 text-center">
                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Commission</p>
                <p className="font-mono font-bold text-slate-400">{dealer.commission.toLocaleString()}</p>
              </div>
              <div className="p-6 border-r border-border/20 text-center">
                <p className="text-[9px] uppercase font-bold text-amber-500/70 mb-1">Liability</p>
                <p className="font-mono font-bold text-amber-400">{dealer.payout.toLocaleString()}</p>
              </div>
              <div className="p-6 text-right pr-8 bg-black/20 text-cyan-400">
                <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Entity Net</p>
                <p className="text-xl font-mono font-black">{dealer.net.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, variant = 'cyan', glow = false }) => {
  const colors = {
    cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    slate: 'text-slate-400 border-slate-700/50 bg-slate-800/20',
    amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
  };

  return (
    <Card className={cn(
      "glass-card border flex flex-col justify-center p-6 relative overflow-hidden",
      colors[variant],
      glow && "shadow-[0_0_20px_rgba(16,185,129,0.1)]"
    )}>
      <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{label}</Label>
      <div className="text-2xl font-mono font-black tracking-tight whitespace-nowrap">
        {value.toLocaleString()} <span className="text-sm font-bold opacity-40 italic">Ks</span>
      </div>
    </Card>
  );
};

export default ReportPage;
