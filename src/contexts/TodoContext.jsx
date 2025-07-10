import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: []
  });

  const addTodo = (todo) => {
    const newTodo = {
      id: Date.now(),
      text: todo.text,
      completed: false,
      priority: todo.priority || 'medium',
      assignedTo: todo.assignedTo || null,
      dueDate: todo.dueDate || null,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TODO', payload: newTodo });
    return newTodo;
  };

  const updateTodo = (id, updates) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, ...updates } });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const setTodos = (todos) => {
    dispatch({ type: 'SET_TODOS', payload: todos });
  };

  const value = {
    todos: state.todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setTodos
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};