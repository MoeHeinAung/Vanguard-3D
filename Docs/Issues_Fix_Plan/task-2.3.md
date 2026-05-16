Task 2.3: Create Reusable Entity Form Component
🎯 Objective
Eliminate UI code duplication between AgentsPage.jsx, MasterDealersPage.jsx, and future entity pages by creating a generic EntityForm component. This enforces design consistency and reduces maintenance overhead.
📋 Prerequisites
Completion of Task 1.1 (Create @/lib/utils)
Access to /workspace/frontend/src/components/
Understanding of React Props and State
🏗️ Architecture Change
Before: Each page implements its own form logic, inputs, and validation (~150 lines per page).
After: A single configurable component handles all standard entity forms (~80 lines total).
🚀 Step-by-Step Execution Plan
Step 1: Verify UI Dependencies
Ensure the required base components exist. If missing, create simple placeholders in /workspace/frontend/src/components/ui/:
input.jsx
label.jsx
textarea.jsx
button.jsx
(Note: If your project uses Shadcn/UI or similar, these likely already exist.)
Step 2: Create the Reusable Component
Create /workspace/frontend/src/components/features/EntityForm.jsx:
javascript
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
Step 3: Refactor AgentsPage.jsx
Update /workspace/frontend/src/pages/AgentsPage.jsx:
Import the new component:
javascript
import EntityForm from '@/components/features/EntityForm'
Replace the existing form JSX (usually inside a modal or sidebar) with:
javascript
{isCreating || isEditing ? (
  <EntityForm 
    entityType="Agent"
    initialData={selectedAgent} // Pass null for Create, object for Edit
    onSubmit={handleFormSubmit}
    onCancel={() => { setIsCreating(false); setSelectedAgent(null); }}
    fields={['id', 'name', 'commission', 'jp_factor', 'sp_factor', 'notes']}
  />
) : (
  // ... existing list view ...
)}
Update handleFormSubmit: Ensure it accepts the formData object passed by the component and maps it to your API call.
Step 4: Refactor MasterDealersPage.jsx
Repeat Step 3 for /workspace/frontend/src/pages/MasterDealersPage.jsx:
Import EntityForm.
Replace the duplicate form JSX with the component usage.
Change entityType="Master Dealer".
Pass selectedMasterDealer as initialData.
Step 5: Verify Behavior
Test both pages:
Create Mode: Ensure ID field is editable, button says "Create".
Edit Mode: Ensure ID field is disabled, existing data is populated, button says "Update".
Validation: Ensure numeric fields only accept numbers.
Cancel: Ensure form closes and state resets correctly.
✅ Completion Checklist
EntityForm.jsx created in components/features/
AgentsPage.jsx refactored to use EntityForm
MasterDealersPage.jsx refactored to use EntityForm
Duplicate form HTML removed from both pages
Create and Edit modes functioning correctly
ID field properly disabled in Edit mode
Visual styling consistent with existing design system
💡 Benefits
Consistency: All entity forms look and behave identically.
Maintainability: Adding a new field (e.g., "email") requires changing only one file.
Scalability: Creating a form for a new entity (e.g., "Retailers") takes minutes instead of hours.
Bug Reduction: Fixes to validation or styling automatically apply to all forms.