/* AgentsPage — Master-Detail Layout */
/* ────────────────────────────────── */
/* Sidebar: Agent list              */
/* Detail: Agent info + edit form   */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { callPython } from '../utils/bridge'
import { Plus, Trash2, Edit2, User } from 'lucide-react'

function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => { loadAgents() }, [])

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
      setIsEdit(false)
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient mb-1">Agent Management</h1>
          <p className="text-sm text-muted-foreground">Manage lottery agents, commissions, and factors.</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setIsEdit(false); }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setIsEdit(false); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4" />
              New Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Agent' : 'New Agent'}</DialogTitle>
            </DialogHeader>
            <AgentForm
              initialData={isEdit ? selectedAgent : null}
              onSubmit={handleSaveAgent}
              onCancel={() => { setIsDialogOpen(false); setIsEdit(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Sidebar: Agent List ── */}
        <Card className="corner-accent">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <User className="inline mr-2 h-4 w-4" />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left px-4 py-3 border-b border-border/30 transition-colors duration-150 ${
                    selectedAgent?.id === agent.id
                      ? 'bg-accent/10 border-l-2 border-l-primary shadow-inner'
                      : 'hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{agent.name}</p>
                    <span className="text-[10px] text-muted-foreground">{agent.id}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Comm: {agent.commission}% &middot; JP: {agent.jp_factor}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Detail Panel ── */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <Card className="corner-accent">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {selectedAgent.name} ({selectedAgent.id})
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => { setIsEdit(true); setIsDialogOpen(true); }}
                    className="transition-colors duration-200 hover:bg-accent/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="text-destructive transition-colors duration-200 hover:bg-destructive/10"
                    onClick={() => handleDelete(selectedAgent.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-surface-container/50 border border-border/30 rounded-none">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Commission</Label>
                    <p className="text-lg font-bold mt-1">{selectedAgent.commission}%</p>
                  </div>
                  <div className="p-3 bg-surface-container/50 border border-border/30 rounded-none">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">JP Factor</Label>
                    <p className="text-lg font-bold mt-1">{selectedAgent.jp_factor}</p>
                  </div>
                  <div className="p-3 bg-surface-container/50 border border-border/30 rounded-none">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">SP Factor</Label>
                    <p className="text-lg font-bold mt-1">{selectedAgent.sp_factor}</p>
                  </div>
                </div>
                <div className="p-3 bg-surface-container/50 border border-border/30 rounded-none">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
                  <p className="text-sm mt-1 text-muted-foreground">{selectedAgent.notes || '—'}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="corner-accent">
              <CardContent className="py-24 text-center">
                <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Select an agent to view details.</p>
              </CardContent>
            </Card>
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
      <div className="space-y-2">
        <Label htmlFor="agent-id">Agent ID</Label>
        <Input
          id="agent-id"
          placeholder="ID (3 chars)"
          value={formData.id}
          onChange={e => setFormData({...formData, id: e.target.value})}
          disabled={!!initialData}
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="agent-name">Name</Label>
        <Input
          id="agent-name"
          placeholder="Full name"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="rounded-none"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="commission">Commission %</Label>
          <Input id="commission" type="number" placeholder="0.0" value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})} className="rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jp_factor">JP Factor</Label>
          <Input id="jp_factor" type="number" placeholder="0.0" value={formData.jp_factor} onChange={e => setFormData({...formData, jp_factor: e.target.value})} className="rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sp_factor">SP Factor</Label>
          <Input id="sp_factor" type="number" placeholder="0.0" value={formData.sp_factor} onChange={e => setFormData({...formData, sp_factor: e.target.value})} className="rounded-none" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Additional notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="rounded-none" />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(formData)}>{initialData ? 'Update Agent' : 'Create Agent'}</Button>
      </div>
    </div>
  )
}

export default AgentsPage