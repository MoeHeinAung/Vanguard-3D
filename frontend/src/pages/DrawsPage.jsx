/* DrawsPage — Master-Detail Layout */
/* ───────────────────────────────── */
/* Sidebar: Draw history list       */
/* Detail: Draw info + settle CTA   */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { callPython } from '../utils/bridge'
import { Plus, Calendar, Clock, Flag, AlertCircle } from 'lucide-react'

function DrawsPage() {
  const [draws, setDraws] = useState([])
  const [selectedDraw, setSelectedDraw] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Settlement Modals
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false)
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false)
  
  const [blacklistForm, setBlacklistModalData] = useState({ ticket: '', type: 'HALF' })
  const [winnersForm, setWinnersModalData] = useState({ ticket: '', type: 'Jackpot' })

  useEffect(() => {
    const loadDraws = async () => {
      try {
        const data = await callPython('get_draws')
        setDraws(data)
        if (data.length > 0 && !selectedDraw) {
          setSelectedDraw(data[0])
        }
      } catch (error) {
        console.error('Failed to fetch draws:', error)
      }
    }
    loadDraws()
  }, [selectedDraw])

  const handleCreateDraw = async (formData) => {
    try {
      await callPython('create_draw', formData)
      setIsDialogOpen(false)
      const data = await callPython('get_draws')
      setDraws(data)
    } catch (error) {
      console.error('Failed to create draw:', error)
    }
  }

  const handleAddBlacklist = async () => {
    if (!selectedDraw) return;
    try {
      await callPython('add_blacklist_ticket', {
        draw_id: selectedDraw.id,
        ticket: blacklistForm.ticket,
        type: blacklistForm.type
      });
      setIsBlacklistModalOpen(false);
      setBlacklistModalData({ ticket: '', type: 'HALF' });
    } catch (error) {
      console.error('Failed to add blacklist ticket:', error);
    }
  };

  const handleAddWinner = async () => {
    if (!selectedDraw) return;
    try {
      await callPython('add_winning_ticket', {
        draw_id: selectedDraw.id,
        ticket: winnersForm.ticket,
        type: winnersForm.type
      });
      setIsWinnersModalOpen(false);
      setWinnersModalData({ ticket: '', type: 'Jackpot' });
    } catch (error) {
      console.error('Failed to add winning ticket:', error);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Open': return 'success'
      case 'Closed': return 'warning'
      case 'Settled': return 'info'
      default: return 'default'
    }
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Page Header */}
      <div className="flex-none flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient mb-1">
            {selectedDraw ? `Draw: ${selectedDraw.draw_date}` : 'Draw Management'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage lottery draw lifecycle and settlements.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Draw
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Lottery Draw</DialogTitle>
            </DialogHeader>
            <DrawForm onSubmit={handleCreateDraw} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Master-Detail Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

        {/* ── Sidebar: Draw History ── */}
        <Card className="corner-accent flex flex-col h-full overflow-hidden">
          <CardHeader className="flex-none">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="inline mr-2 h-4 w-4" />
              History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin">
              {draws.map((draw) => (
                <button
                  key={draw.id}
                  onClick={() => setSelectedDraw(draw)}
                  className={`w-full text-left px-4 py-3 border-b border-border/30 transition-colors duration-150 ${
                    selectedDraw?.id === draw.id
                      ? 'bg-accent/10 border-l-2 border-l-primary shadow-inner'
                      : 'hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{draw.draw_date}</p>
                    <Badge
                      variant={
                        draw.status === 'Open' ? 'success' :
                        draw.status === 'Closed' ? 'warning' :
                        draw.status === 'Settled' ? 'info' : 'default'
                      }
                      className="text-[10px]"
                    >
                      {draw.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{draw.cutoff_time}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Detail Panel ── */}
        <div className="lg:col-span-2 h-full overflow-hidden flex flex-col">
          {selectedDraw ? (
            <Card className="corner-accent h-full flex flex-col overflow-hidden">
              <CardHeader className="flex-none flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-primary" />
                  Draw Information
                </CardTitle>
                <Badge
                  variant={
                    selectedDraw.status === 'Open' ? 'success' :
                    selectedDraw.status === 'Closed' ? 'warning' : 'info'
                  }
                >
                  {selectedDraw.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 space-y-6 overflow-y-auto scrollbar-thin pb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-surface-container/50 border border-border/30 rounded-none">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cutoff Time</Label>
                    <p className="text-xl font-bold mt-1 font-mono">{selectedDraw.cutoff_time}</p>
                  </div>
                  <div className="p-4 bg-surface-container/50 border border-border/30 rounded-none">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Created</Label>
                    <p className="text-xl font-bold mt-1">{selectedDraw.created_at}</p>
                  </div>
                </div>

                <div className="p-4 bg-surface-container/50 border border-border/30 rounded-none">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal Notes</Label>
                  <p className="text-sm mt-1 text-muted-foreground whitespace-pre-wrap">
                    {selectedDraw.notes || 'No administrative notes for this draw.'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Dialog open={isBlacklistModalOpen} onOpenChange={setIsBlacklistModalOpen}>
                    <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsBlacklistModalOpen(true)}>
                      <AlertCircle className="h-4 w-4" />
                      Manage Blacklist
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add to Blacklist</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Ticket Number</Label>
                          <Input 
                            placeholder="e.g. 123" 
                            value={blacklistForm.ticket}
                            onChange={(e) => setBlacklistModalData({ ...blacklistForm, ticket: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Reduction Type</Label>
                          <select 
                            className="w-full bg-background border border-border p-2 rounded-none text-sm"
                            value={blacklistForm.type}
                            onChange={(e) => setBlacklistModalData({ ...blacklistForm, type: e.target.value })}
                          >
                            <option value="HALF">HALF (50% Payout)</option>
                            <option value="BLOCK">BLOCK (Pending Offload)</option>
                          </select>
                        </div>
                        <Button className="w-full" onClick={handleAddBlacklist}>Add Blacklist Entry</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isWinnersModalOpen} onOpenChange={setIsWinnersModalOpen}>
                    <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsWinnersModalOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Declare Winners
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Declare Winning Ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Ticket Number</Label>
                          <Input 
                            placeholder="e.g. 123" 
                            value={winnersForm.ticket}
                            onChange={(e) => setWinnersModalData({ ...winnersForm, ticket: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Prize Type</Label>
                          <select 
                            className="w-full bg-background border border-border p-2 rounded-none text-sm"
                            value={winnersForm.type}
                            onChange={(e) => setWinnersModalData({ ...winnersForm, type: e.target.value })}
                          >
                            <option value="Jackpot">Jackpot</option>
                            <option value="Minor">Minor</option>
                          </select>
                        </div>
                        <Button className="w-full" onClick={handleAddWinner}>Record Winner</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {selectedDraw.status === 'Closed' && (
                  <Button className="btn-primary-gradient w-full" size="lg">
                    Settle Draw &amp; Calculate Payouts
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="corner-accent h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Flag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Select a draw from the history to view details.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function DrawForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    draw_date: '',
    cutoff_time: '',
    notes: ''
  })

  const handleSubmit = () => {
    onSubmit(formData)
    setFormData({ draw_date: '', cutoff_time: '', notes: '' })
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="draw_date">Draw Date</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="draw_date"
            type="date"
            className="pl-10"
            value={formData.draw_date}
            onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cutoff_time">Cutoff Time</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="cutoff_time"
            type="time"
            className="pl-10"
            value={formData.cutoff_time}
            onChange={(e) => setFormData({ ...formData, cutoff_time: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Optional administrative notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Initialize Draw</Button>
      </div>
    </div>
  )
}

export default DrawsPage