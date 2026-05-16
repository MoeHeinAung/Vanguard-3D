import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

/**
 * Generic Form Component for CRUD operations on standard entities.
 * 
 * @param {string} entityType - Name of the entity (e.g., "Agent", "Master Dealer")
 * @param {object} initialData - If present, form acts as "Edit mode". If null, "Create mode".
 * @param {function} onSubmit - Callback with formData when submitted.
 * @param {function} onCancel - Callback when cancel button clicked.
 * @param {array} fields - List of fields to render. Default: ['id', 'name', 'commission', 'jp_factor', 'sp_factor', 'notes']
 */
export default function EntityForm({ 
  entityType = 'Entity',
  initialData = null,
  onSubmit,
  onCancel,
  fields = ['id', 'name', 'commission', 'jp_factor', 'sp_factor', 'notes']
}) {
  const [formData, setFormData] = useState(initialData || {
    id: '',
    name: '',
    commission: '',
    jp_factor: '',
    sp_factor: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 animate-fade-in">
      {/* ID Field */}
      {fields.includes('id') && (
        <div className="space-y-2">
          <Label htmlFor={`${entityType.toLowerCase()}-id`}>{entityType} ID</Label>
          <Input
            id={`${entityType.toLowerCase()}-id`}
            placeholder="ID (3 chars)"
            value={formData.id}
            onChange={(e) => handleChange('id', e.target.value)}
            disabled={!!initialData} // Disable ID editing in Update mode
            className="rounded-none"
            maxLength={3}
          />
        </div>
      )}

      {/* Name Field */}
      {fields.includes('name') && (
        <div className="space-y-2">
          <Label htmlFor={`${entityType.toLowerCase()}-name`}>Name</Label>
          <Input
            id={`${entityType.toLowerCase()}-name`}
            placeholder={`Enter ${entityType.toLowerCase()} name`}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="rounded-none"
          />
        </div>
      )}

      {/* Numeric Factors Grid */}
      {(fields.includes('commission') || fields.includes('jp_factor') || fields.includes('sp_factor')) && (
        <div className="grid grid-cols-3 gap-4">
          {fields.includes('commission') && (
            <div className="space-y-2">
              <Label htmlFor="commission">Commission %</Label>
              <Input 
                id="commission" 
                type="number" 
                step="0.1"
                placeholder="0.0" 
                value={formData.commission} 
                onChange={(e) => handleChange('commission', e.target.value)} 
                className="rounded-none" 
              />
            </div>
          )}
          
          {fields.includes('jp_factor') && (
            <div className="space-y-2">
              <Label htmlFor="jp_factor">JP Factor</Label>
              <Input 
                id="jp_factor" 
                type="number" 
                step="0.1"
                placeholder="0.0" 
                value={formData.jp_factor} 
                onChange={(e) => handleChange('jp_factor', e.target.value)} 
                className="rounded-none" 
              />
            </div>
          )}
          
          {fields.includes('sp_factor') && (
            <div className="space-y-2">
              <Label htmlFor="sp_factor">SP Factor</Label>
              <Input 
                id="sp_factor" 
                type="number" 
                step="0.1"
                placeholder="0.0" 
                value={formData.sp_factor} 
                onChange={(e) => handleChange('sp_factor', e.target.value)} 
                className="rounded-none" 
              />
            </div>
          )}
        </div>
      )}

      {/* Notes Field */}
      {fields.includes('notes') && (
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Additional notes..." 
            value={formData.notes} 
            onChange={(e) => handleChange('notes', e.target.value)} 
            className="rounded-none min-h-[80px]" 
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="rounded-none"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="rounded-none bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? `Update ${entityType}` : `Create ${entityType}`}
        </Button>
      </div>
    </form>
  )
}
