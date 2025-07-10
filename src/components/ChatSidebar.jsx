// src/components/ChatSidebar.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useChatContext } from '../ChatContext'
import { useTodoContext } from '../TodoContext'

function ChatSidebar() {
  const {
    messages,
    isLoading,
    apiKey,
    isChatOpen,
    setIsChatOpen,
    clearChat,
    sendMessage,
  } = useChatContext()

  const { todos, getOverallProgress } = useTodoContext()

  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 채팅이 열릴 때 입력창에 포커스
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isChatOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Todo 컨텍스트 정보 준비
    const todoContext = {
      todos,
      progress: getOverallProgress ? getOverallProgress() : 0,
      teamMembers: [], // 팀멤버 정보는 App에서 관리되므로 필요시 props로 전달
    }

    await sendMessage(inputMessage, todoContext)
    setInputMessage('')

    // 메시지 전송 후 입력창에 포커스 (setTimeout으로 지연)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* 채팅 사이드바 */}
      <div className="fixed top-0 right-0 w-96 h-screen bg-white border-l-4 border-wood-brown z-50 flex flex-col shadow-lg">
        <div className="p-4 bg-wood-brown text-cream border-b-2 border-wood-dark flex justify-between items-center">
          <h3 className="m-0 text-base font-mono">Todo Assistant</h3>
          <div className="flex gap-1">
            <button
              className="bg-transparent border border-cream text-cream px-2 py-1 cursor-pointer rounded hover:bg-wood-dark text-xl"
              onClick={clearChat}
              title="채팅 기록 삭제"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 bg-cream">
          {messages.length === 0 ? (
            <div className="text-center text-gray-600 p-5 leading-relaxed">
              <p className="m-0 mb-2">👋 안녕하세요!</p>
              <p className="m-0 mb-2">Todo 관리를 도와드릴게요.</p>
              <p className="m-0 mb-2">
                할일 추가, 우선순위 설정, 팀 관리 등 무엇이든 물어보세요!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex flex-col ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-4/5 p-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    message.role === 'user'
                      ? 'bg-info text-white rounded-br-sm'
                      : message.isError
                      ? 'bg-red-100 border border-red-400 text-red-700 rounded-bl-sm'
                      : 'bg-white border border-gray-300 rounded-bl-sm'
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="mb-4 flex flex-col items-start">
              <div className="max-w-4/5 p-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap break-words bg-white border border-gray-300 rounded-bl-sm flex gap-1 items-center">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce"
                  style={{ animationDelay: '-0.32s' }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce"
                  style={{ animationDelay: '-0.16s' }}
                ></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="p-4 bg-white border-t-2 border-wood-brown">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                apiKey
                  ? '메시지를 입력하세요...'
                  : '.env 파일에서 API 키를 설정해주세요'
              }
              className="flex-1 p-2 border-2 border-wood-brown rounded font-mono text-sm resize-none max-h-24 h-16 focus:outline-none focus:ring-2 focus:ring-wood-brown disabled:bg-gray-100 disabled:text-gray-400"
              rows="2"
              disabled={!apiKey || isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !apiKey || isLoading}
              className="px-3 py-2 bg-success border-2 border-wood-brown rounded cursor-pointer text-base min-w-11 h-16 flex items-center justify-center hover:bg-green-600 transition-colors disabled:bg-white disabled:cursor-not-allowed"
            >
              입력
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatSidebar
