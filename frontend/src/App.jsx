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
