/* AgentsPage — Master-Detail Layout */
/* ────────────────────────────────── */
/* Sidebar: Agent list              */
/* Detail: Agent info + edit form   */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import EntityForm from '@/components/features/EntityForm'
import { callPython } from '../utils/bridge'
import { Plus, Trash2, Edit2, User } from 'lucide-react'
import { useNotification } from '@/context/NotificationContext'

function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const { notifySuccess, notifyError } = useNotification()

  useEffect(() => { loadAgents() }, [])

  const loadAgents = async () => {
    try {
      const data = await callPython('get_agents')
      setAgents(data)
    } catch (error) {
      notifyError(`Failed to fetch agents: ${error.message}`)
    }
  }

  const handleSaveAgent = async (formData) => {
    try {
      if (isEdit) {
        await callPython('update_agent', formData)
        notifySuccess('Agent updated successfully')
      } else {
        await callPython('create_agent', formData)
        notifySuccess('Agent created successfully')
      }
      setIsDialogOpen(false)
      loadAgents()
      setSelectedAgent(null)
      setIsEdit(false)
    } catch (error) {
      notifyError(`Failed to save agent: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        await callPython('delete_agent', id)
        notifySuccess('Agent deleted successfully')
        loadAgents()
        setSelectedAgent(null)
      } catch (error) {
        notifyError(`Failed to delete agent: ${error.message}`)
      }
    }
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Page Header */}
      <div className="flex-none flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
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
              <DialogDescription>
                {isEdit ? 'Update the details for this agent.' : 'Enter the details for a new agent.'}
              </DialogDescription>
            </DialogHeader>
            <EntityForm
              entityType="Agent"
              initialData={isEdit ? selectedAgent : null}
              onSubmit={handleSaveAgent}
              onCancel={() => { setIsDialogOpen(false); setIsEdit(false); }}
              fields={['id', 'name', 'commission', 'jp_factor', 'sp_factor', 'notes']}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Master-Detail Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

        {/* ── Sidebar: Agent List ── */}
        <Card className="corner-accent flex flex-col h-full overflow-hidden">
          <CardHeader className="flex-none">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <User className="inline mr-2 h-4 w-4" />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin">
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
        <div className="lg:col-span-2 h-full overflow-hidden flex flex-col">
          {selectedAgent ? (
            <Card className="corner-accent h-full flex flex-col overflow-hidden">
              <CardHeader className="flex-none flex flex-row items-center justify-between">
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
              <CardContent className="flex-1 space-y-6 overflow-y-auto scrollbar-thin pb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-900/50 border border-border/30 rounded-none">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Commission</Label>
                    <p className="text-lg font-bold mt-1">{selectedAgent.commission}%</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 border border-border/30 rounded-none">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">JP Factor</Label>
                    <p className="text-lg font-bold mt-1">{selectedAgent.jp_factor}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 border border-border/30 rounded-none">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">SP Factor</Label>
                    <p className="text-lg font-bold mt-1">{selectedAgent.sp_factor}</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-900/50 border border-border/30 rounded-none">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
                  <p className="text-sm mt-1 text-muted-foreground whitespace-pre-wrap">{selectedAgent.notes || '—'}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="corner-accent h-full flex items-center justify-center">
              <CardContent className="text-center">
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

export default AgentsPage