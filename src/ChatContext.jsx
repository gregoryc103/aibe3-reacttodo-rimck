// src/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const ChatContext = createContext()

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  // 환경변수에서 API 키 가져오기
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  // localStorage에서 메시지 로드
  useEffect(() => {
    const savedMessages = localStorage.getItem('todoagent_chat_messages')

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error('Failed to parse saved messages:', error)
      }
    }
  }, [])

  // 메시지가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('todoagent_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  const addMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('todoagent_chat_messages')
  }

  const sendMessage = async (userMessage, todoContext = null) => {
    if (!apiKey) {
      alert('API 키가 설정되지 않았습니다. .env 파일에서 VITE_OPENAI_API_KEY를 설정해주세요.')
      return
    }

    // 사용자 메시지 추가
    addMessage({
      role: 'user',
      content: userMessage,
    })

    setIsLoading(true)

    try {
      // 시스템 메시지 구성
      let systemMessage = `당신은 팀 할일 관리를 도와주는 AI 어시스턴트입니다. 
사용자의 할일 관리, 팀 협업, 업무 우선순위 설정 등을 도와주세요.
항상 친근하고 도움이 되는 톤으로 답변해주세요.`

      // TodoContext가 있다면 추가 정보 제공
      if (todoContext) {
        systemMessage += `\n\n현재 할일 현황:
- 전체 할일: ${todoContext.todos?.length || 0}개
- 완료된 할일: ${
          todoContext.todos?.filter((todo) => todo.completed).length || 0
        }개
- 진행률: ${todoContext.progress || 0}%
- 팀원 수: ${todoContext.teamMembers?.length || 0}명`
      }

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemMessage },
              ...messages.slice(-10), // 최근 10개 메시지만 포함 (토큰 절약)
              { role: 'user', content: userMessage },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content

      // AI 응답 추가
      addMessage({
        role: 'assistant',
        content: assistantMessage,
      })
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage({
        role: 'assistant',
        content:
          '죄송합니다. 오류가 발생했습니다. API 키를 확인하고 다시 시도해주세요.',
        isError: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue = {
    messages,
    isLoading,
    apiKey,
    isChatOpen,
    setIsChatOpen,
    addMessage,
    clearChat,
    sendMessage,
  }

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  )
}
