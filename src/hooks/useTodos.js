import { useEffect } from 'react';
import { useTodoContext } from '../contexts/TodoContext';

const STORAGE_KEY = 'react-todo-app-todos';

export const useTodos = () => {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, setTodos } = useTodoContext();

  // 로컬 스토리지에서 todos 로드
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Failed to parse saved todos:', error);
      }
    }
  }, [setTodos]);

  // todos 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 새 todo 추가
  const createTodo = (text) => {
    if (!text.trim()) return;
    addTodo({ text: text.trim() });
  };

  // todo 수정
  const editTodo = (id, newText) => {
    if (!newText.trim()) return;
    updateTodo(id, { text: newText.trim() });
  };

  // todo 삭제
  const removeTodo = (id) => {
    deleteTodo(id);
  };

  // todo 완료 상태 토글
  const toggleComplete = (id) => {
    toggleTodo(id);
  };

  // 완료된 todos 가져오기
  const getCompletedTodos = () => {
    return todos.filter(todo => todo.completed);
  };

  // 미완료된 todos 가져오기
  const getActiveTodos = () => {
    return todos.filter(todo => !todo.completed);
  };

  // 전체 todos 개수
  const getTotalCount = () => {
    return todos.length;
  };

  // 완료된 todos 개수
  const getCompletedCount = () => {
    return getCompletedTodos().length;
  };

  // 미완료된 todos 개수
  const getActiveCount = () => {
    return getActiveTodos().length;
  };

  // 모든 todos 완료 상태로 변경
  const markAllCompleted = () => {
    const activeTodos = getActiveTodos();
    activeTodos.forEach(todo => {
      toggleTodo(todo.id);
    });
  };

  // 완료된 todos 일괄 삭제
  const clearCompleted = () => {
    const completedTodos = getCompletedTodos();
    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  return {
    todos,
    createTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    getCompletedTodos,
    getActiveTodos,
    getTotalCount,
    getCompletedCount,
    getActiveCount,
    markAllCompleted,
    clearCompleted
  };
};