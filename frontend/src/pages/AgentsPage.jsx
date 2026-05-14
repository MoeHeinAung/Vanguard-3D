import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { callPython } from '../utils/bridge'
import { Plus, Trash2, Edit2 } from 'lucide-react'

function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const data = await callPython('get_agents')
      setAgents(data)
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  const handleSaveAgent = async (formData) => {
    try {
      if (isEdit) {
        await callPython('update_agent', formData)
      } else {
        await callPython('create_agent', formData)
      }
      setIsDialogOpen(false)
      loadAgents()
      setSelectedAgent(null)
    } catch (error) {
      console.error('Failed to save agent:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        await callPython('delete_agent', id)
        loadAgents()
        setSelectedAgent(null)
      } catch (error) {
        console.error('Failed to delete agent:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-gradient">Agent Management</h1>
          <p className="text-muted-foreground mt-1">Manage lottery agents, commissions, and factors.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setIsEdit(false); }}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setIsEdit(false)}>
              <Plus className="h-4 w-4" /> New Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Agent' : 'New Agent'}</DialogTitle>
            </DialogHeader>
            <AgentForm 
              initialData={isEdit ? selectedAgent : null} 
              onSubmit={handleSaveAgent} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Agents</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[60vh] overflow-y-auto">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left p-4 border-b border-border transition-colors duration-200 ${
                    selectedAgent?.id === agent.id
                      ? 'bg-accent/10 border-l-2 border-l-primary ring-1 ring-primary/10'
                      : 'hover:bg-accent/10'
                  }`}
                >
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.id}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedAgent ? (
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{selectedAgent.name} ({selectedAgent.id})</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { setIsEdit(true); setIsDialogOpen(true); }}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(selectedAgent.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Commission</Label><p>{selectedAgent.commission}%</p></div>
                  <div><Label className="text-xs text-muted-foreground">JP Factor</Label><p>{selectedAgent.jp_factor}</p></div>
                  <div><Label className="text-xs text-muted-foreground">SP Factor</Label><p>{selectedAgent.sp_factor}</p></div>
                </div>
                <div><Label className="text-xs text-muted-foreground">Notes</Label><p>{selectedAgent.notes || '-'}</p></div>
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Select an agent to view details</CardContent></Card>
          )}
        </div>
      </div>
    </div>
  )
}

function AgentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || { id: '', name: '', commission: '', jp_factor: '', sp_factor: '', notes: '' })

  return (
    <div className="space-y-4 mt-4">
      <Input placeholder="ID (3 chars)" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={!!initialData} />
      <Input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <div className="grid grid-cols-3 gap-2">
        <Input type="number" placeholder="Comm %" value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})} />
        <Input type="number" placeholder="JP Factor" value={formData.jp_factor} onChange={e => setFormData({...formData, jp_factor: e.target.value})} />
        <Input type="number" placeholder="SP Factor" value={formData.sp_factor} onChange={e => setFormData({...formData, sp_factor: e.target.value})} />
      </div>
      <Textarea placeholder="Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(formData)}>Save Agent</Button>
      </div>
    </div>
  )
}

export default AgentsPage
