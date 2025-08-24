import React from 'react'

export default function App() {
  return (
    <div style={{ 
      color: 'white', 
      backgroundColor: '#000', 
      height: '100vh', 
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1>KongossaDoc - Application Test</h1>
      <p>Si vous voyez ce message, React fonctionne correctement.</p>
      <p>Port: http://localhost:5174/</p>
    </div>
  )
}