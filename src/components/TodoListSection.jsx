import { useState } from 'react';
import TodoItem from './TodoItem';
import { useTodos } from '../hooks/useTodos';

const TodoListSection = () => {
  const {
    todos,
    createTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    getActiveCount,
    getCompletedCount,
    markAllCompleted,
    clearCompleted
  } = useTodos();

  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = getActiveCount();
  const completedCount = getCompletedCount();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">할 일 목록</h2>
          <div className="text-sm text-gray-600">
            {activeCount > 0 && `${activeCount}개 남음`}
            {completedCount > 0 && activeCount > 0 && ' · '}
            {completedCount > 0 && `${completedCount}개 완료`}
          </div>
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            전체 ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            진행중 ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            완료 ({completedCount})
          </button>
        </div>
      </div>

      {/* Todo 목록 */}
      <div className="px-6 py-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === 'all' && '할 일이 없습니다.'}
            {filter === 'active' && '진행중인 할 일이 없습니다.'}
            {filter === 'completed' && '완료된 할 일이 없습니다.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleComplete}
                onEdit={editTodo}
                onDelete={removeTodo}
              />
            ))}
          </div>
        )}
      </div>

      {/* 푸터 액션 버튼 */}
      {todos.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={markAllCompleted}
              disabled={activeCount === 0}
              className={`text-sm font-medium transition-colors ${
                activeCount === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              모두 완료
            </button>
            <button
              onClick={clearCompleted}
              disabled={completedCount === 0}
              className={`text-sm font-medium transition-colors ${
                completedCount === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-800'
              }`}
            >
              완료된 항목 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoListSection;