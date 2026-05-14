# Environment Setup and Bridge Connection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the project's foundation by installing MUI, scaffolding the backend, and connecting Python with React via pywebview.

**Architecture:** Use `pywebview` to expose a Python `API` class to the frontend. The frontend will communicate via a JS utility that waits for the `pywebviewready` event.

**Tech Stack:** Python, React JSX, MUI, pywebview.

---

### Task 1: Install Frontend Dependencies

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install MUI and Icons**
Run: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material` in `frontend/` directory.

- [ ] **Step 2: Verify package.json**
Check that dependencies are added.

- [ ] **Step 3: Commit**
```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore: install MUI and icons"
```

---

### Task 2: Scaffold Backend Structure

**Files:**
- Create: `backend/api/__init__.py`
- Create: `backend/database/__init__.py`
- Create: `backend/models/__init__.py`
- Create: `backend/services/__init__.py`

- [ ] **Step 1: Create directories and init files**
Create the folder structure as defined in SSOT.md.

- [ ] **Step 2: Commit**
```bash
git add backend/
git commit -m "chore: scaffold backend directory structure"
```

---

### Task 3: Implement Python API and Bridge in main.py

**Files:**
- Modify: `main.py`

- [ ] **Step 1: Write API class and main entry point**
```python
import webview
import os

class API:
    def hello(self):
        return "Hello from Python!"

def main():
    api = API()
    # In development, we load the Vite dev server
    # In production, we would load the index.html from dist
    window = webview.create_window(
        'Vanguard 3D',
        'http://localhost:5173',
        js_api=api
    )
    webview.start()

if __name__ == '__main__':
    main()
```

- [ ] **Step 2: Commit**
```bash
git add main.py
git commit -m "feat: implement pywebview bridge in main.py"
```

---

### Task 4: Implement JS Bridge Utility

**Files:**
- Create: `frontend/src/utils/bridge.js`

- [ ] **Step 1: Create the bridge wrapper**
```javascript
export const getPythonApi = () => {
  return new Promise((resolve) => {
    if (window.pywebview && window.pywebview.api) {
      resolve(window.pywebview.api);
    } else {
      window.addEventListener('pywebviewready', () => {
        resolve(window.pywebview.api);
      });
    }
  });
};

export const callPython = async (method, ...args) => {
  const api = await getPythonApi();
  if (api[method]) {
    return await api[method](...args);
  }
  throw new Error(`Method ${method} not found on Python API`);
};
```

- [ ] **Step 2: Commit**
```bash
git add frontend/src/utils/bridge.js
git commit -m "feat: add frontend bridge utility"
```

---

### Task 5: Verification in App.jsx

**Files:**
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Add a test button to call Python**
```javascript
import { useState } from 'react'
import { Button, Typography, Container, Box } from '@mui/material'
import { callPython } from './utils/bridge'

function App() {
  const [message, setMessage] = useState('Waiting for Python...')

  const handleHello = async () => {
    try {
      const response = await callPython('hello')
      setMessage(response)
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  return (
    <Container>
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vanguard 3D
        </Typography>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>
        <Button variant="contained" onClick={handleHello}>
          Say Hello to Python
        </Button>
      </Box>
    </Container>
  )
}

export default App
```

- [ ] **Step 2: Verify manually**
1. Run `npm run dev` in `frontend/`.
2. Run `python main.py` in root.
3. Click the button and check if "Hello from Python!" appears.

- [ ] **Step 3: Commit**
```bash
git add frontend/src/App.jsx
git commit -m "feat: verify bridge connection with simple button"
```
