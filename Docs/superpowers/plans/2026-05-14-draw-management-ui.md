# Draw Management UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete UI for managing lottery draws, including a Navbar, a sidebar for draw history, and a detail view with creation capabilities.

**Architecture:** Master-Detail pattern. React frontend communicates with Python `DrawService` via the `pywebview` bridge.

**Tech Stack:** React, MUI, pywebview.

---

### Task 1: Expose DrawService to Python API

**Files:**
- Modify: `main.py`

- [x] **Step 1: Update API class to use DrawService**
```python
import webview
import os
from backend.database.manager import DatabaseManager
from backend.services.draw_service import DrawService

class API:
    def __init__(self):
        self.db = DatabaseManager()
        self.draw_service = DrawService(self.db)

    def hello(self):
        return "Hello from Python!"

    def get_draws(self):
        # Refresh statuses before returning
        self.draw_service.update_statuses()
        return self.draw_service.get_all_draws()

    def create_draw(self, data):
        return self.draw_service.create_draw(
            data['draw_date'], 
            data['cutoff_time'], 
            data.get('notes')
        )
    
    def settle_draw(self, draw_id):
        return self.draw_service.settle_draw(draw_id)

def main():
    api = API()
    # ... rest of main.py
```

- [x] **Step 2: Commit**
```bash
git add main.py
git commit -m "feat: expose DrawService methods via pywebview API"
```

---

### Task 2: Implement Navbar Component

**Files:**
- Create: `frontend/src/components/layout/Navbar.jsx`

- [x] **Step 1: Create Navbar with MUI**
```javascript
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

const Navbar = ({ onNavigate }) => {
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            VANGUARD 3D
          </Typography>
          <Button color="inherit" onClick={() => onNavigate('draws')}>
            Draws
          </Button>
          <Button color="inherit" onClick={() => onNavigate('home')}>
            Home
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
```

- [x] **Step 2: Commit**
```bash
git add frontend/src/components/layout/Navbar.jsx
git commit -m "feat: add Navbar component"
```

---

### Task 3: Implement Draw Creation Dialog

**Files:**
- Create: `frontend/src/components/features/draws/DrawDialog.jsx`

- [x] **Step 1: Create Dialog with form fields**
```javascript
import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box 
} from '@mui/material';

const DrawDialog = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    draw_date: '',
    cutoff_time: '',
    notes: ''
  });

  const handleSubmit = () => {
    onCreate(formData);
    setFormData({ draw_date: '', cutoff_time: '', notes: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Draw</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Draw Date"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={formData.draw_date}
            onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
          />
          <TextField
            label="Cutoff Time"
            type="time"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={formData.cutoff_time}
            onChange={(e) => setFormData({ ...formData, cutoff_time: e.target.value })}
          />
          <TextField
            label="Notes"
            multiline
            rows={3}
            fullWidth
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawDialog;
```

- [x] **Step 2: Commit**
```bash
git add frontend/src/components/features/draws/DrawDialog.jsx
git commit -m "feat: add DrawDialog component"
```

---

### Task 4: Implement Draw Management Page (Sidebar & Detail)

**Files:**
- Create: `frontend/src/pages/DrawsPage.jsx`

- [x] **Step 1: Implement the Master-Detail view**
```javascript
import { useState, useEffect } from 'react';
import { 
  Box, Grid, List, ListItemButton, ListItemText, 
  Typography, Paper, Chip, Button, Divider 
} from '@mui/material';
import { callPython } from '../utils/bridge';
import DrawDialog from '../components/features/draws/DrawDialog';

const DrawsPage = () => {
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchDraws = async () => {
    const data = await callPython('get_draws');
    setDraws(data);
    if (data.length > 0 && !selectedDraw) {
      setSelectedDraw(data[0]);
    } else if (selectedDraw) {
        const updated = data.find(d => d.id === selectedDraw.id);
        if (updated) setSelectedDraw(updated);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleCreateDraw = async (formData) => {
    await callPython('create_draw', formData);
    setIsDialogOpen(false);
    fetchDraws();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'success';
      case 'Closed': return 'default';
      case 'Settled': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">History</Typography>
            </Box>
            <Divider />
            <List>
              {draws.map((draw) => (
                <ListItemButton 
                  key={draw.id} 
                  selected={selectedDraw?.id === draw.id}
                  onClick={() => setSelectedDraw(draw)}
                >
                  <ListItemText 
                    primary={draw.draw_date} 
                    secondary={<Chip label={draw.status} size="small" color={getStatusColor(draw.status)} />} 
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Detail Area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, height: '70vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4">
                {selectedDraw ? `Draw: ${selectedDraw.draw_date}` : 'Select a Draw'}
              </Typography>
              <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
                New Draw
              </Button>
            </Box>

            {selectedDraw && (
              <Box>
                <Chip 
                  label={selectedDraw.status} 
                  color={getStatusColor(selectedDraw.status)} 
                  sx={{ mb: 2, fontWeight: 'bold' }} 
                />
                <Typography variant="body1" gutterBottom>
                  <strong>Cutoff Time:</strong> {selectedDraw.cutoff_time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Created At:</strong> {selectedDraw.created_at}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Notes:</strong><br />
                  {selectedDraw.notes || 'No notes provided.'}
                </Typography>

                {selectedDraw.status === 'Closed' && (
                  <Button variant="contained" color="primary" sx={{ mt: 4 }}>
                    Enter Winning Numbers (Settle)
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <DrawDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onCreate={handleCreateDraw} 
      />
    </Box>
  );
};

export default DrawsPage;
```

- [x] **Step 2: Commit**
```bash
git add frontend/src/pages/DrawsPage.jsx
git commit -m "feat: implement DrawsPage with Master-Detail view"
```

---

### Task 5: Finalize App.jsx and Navigation

**Files:**
- Modify: `frontend/src/App.jsx`

- [x] **Step 1: Integrate Navbar and DrawsPage**
```javascript
import { useState } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography } from '@mui/material'
import Navbar from './components/layout/Navbar'
import DrawsPage from './pages/DrawsPage'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' }
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('draws');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar onNavigate={setCurrentPage} />
      <Container maxWidth="xl">
        {currentPage === 'draws' ? (
          <DrawsPage />
        ) : (
          <Box sx={{ p: 4 }}>
            <Typography variant="h4">Welcome to Vanguard 3D</Typography>
            <Typography variant="body1">Use the Navbar to manage your lottery draws.</Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App
```

- [x] **Step 2: Commit**
```bash
git add frontend/src/App.jsx
git commit -m "feat: wire up navigation and DrawPage in App.jsx"
```
