import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { callPython } from '../utils/bridge'
import { Plus, Calendar, Clock } from 'lucide-react'

function DrawsPage() {
  const [draws, setDraws] = useState([])
  const [selectedDraw, setSelectedDraw] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Open': return 'success'
      case 'Closed': return 'warning'
      case 'Settled': return 'info'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-gradient">
            {selectedDraw ? `Draw Details: ${selectedDraw.draw_date}` : 'Draw Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage lottery draw lifecycle and settlements.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Draw History */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[60vh] overflow-y-auto">
              {draws.map((draw) => (
                <button
                  key={draw.id}
                  onClick={() => setSelectedDraw(draw)}
                  className={`w-full text-left p-4 border-b border-border transition-colors duration-200 ${
                    selectedDraw?.id === draw.id
                      ? 'bg-accent/10 border-l-2 border-l-primary ring-1 ring-primary/10'
                      : 'hover:bg-accent/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{draw.draw_date}</p>
                      <p className="text-sm text-muted-foreground">{draw.cutoff_time}</p>
                    </div>
                    <Badge variant={getStatusVariant(draw.status)} className="text-xs">
                      {draw.status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDraw ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Draw Information
                  <Badge variant={getStatusVariant(selectedDraw.status)} className="text-sm">
                    {selectedDraw.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Cutoff Time</Label>
                    <p className="text-lg font-medium mt-1">{selectedDraw.cutoff_time}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Date Created</Label>
                    <p className="text-lg font-medium mt-1">{selectedDraw.created_at}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Internal Notes</Label>
                  <p className="text-lg font-medium mt-1">
                    {selectedDraw.notes || 'No administrative notes for this draw.'}
                  </p>
                </div>

                {selectedDraw.status === 'Closed' && (
                  <Button className="w-full" size="lg">
                    Settle Draw & Enter Winning Numbers
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Select a draw from the history to view details.</p>
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