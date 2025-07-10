// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { TodoProvider } from './TodoContext.jsx'
import { ChatProvider } from './ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </TodoProvider>
  </StrictMode>
)
