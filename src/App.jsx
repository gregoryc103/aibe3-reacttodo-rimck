import { TodoProvider } from './contexts/TodoContext';
import { ChatProvider } from './contexts/ChatContext';
import { useChatContext } from './contexts/ChatContext';
import { useTodos } from './hooks/useTodos';
import TodoWriteForm from './components/TodoWriteForm';
import TodoListSection from './components/TodoListSection';
import ChatSidebar from './components/ChatSidebar';

const AppContent = () => {
  const { createTodo } = useTodos();
  const { toggleSidebar } = useChatContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Todo App with Chat</h1>
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              채팅
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Todo 작성 폼 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">새 할 일 추가</h2>
            <TodoWriteForm onAddTodo={createTodo} />
          </div>

          {/* Todo 목록 */}
          <TodoListSection />
        </div>
      </main>

      {/* 채팅 사이드바 */}
      <ChatSidebar />
    </div>
  );
};

function App() {
  return (
    <TodoProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </TodoProvider>
  );
}

export default App;