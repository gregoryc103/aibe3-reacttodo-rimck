import { useState } from 'react';
import { useChatContext } from '../contexts/ChatContext';

const ChatSidebar = () => {
  const { messages, isSidebarOpen, addMessage, toggleSidebar } = useChatContext();
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addMessage({ text: inputValue.trim(), sender: 'user' });
      setInputValue('');
      
      // 간단한 자동 응답 (실제 채팅 시스템에서는 API 호출 등으로 처리)
      setTimeout(() => {
        addMessage({ 
          text: '메시지를 받았습니다!', 
          sender: 'bot' 
        });
      }, 1000);
    }
  };

  return (
    <>
      {/* 사이드바 */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <h3 className="text-lg font-semibold">채팅</h3>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-blue-700 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>아직 메시지가 없습니다.</p>
                <p className="text-sm mt-2">첫 메시지를 보내보세요!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 입력 폼 */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                전송
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default ChatSidebar;