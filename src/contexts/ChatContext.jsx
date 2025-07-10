import { createContext, useContext, useReducer } from 'react';

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: []
      };
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        isSidebarOpen: action.payload
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    isSidebarOpen: false
  });

  const addMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      text: message.text,
      sender: message.sender || 'user',
      timestamp: new Date().toISOString()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  };

  const setMessages = (messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const setSidebarOpen = (isOpen) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: isOpen });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const value = {
    messages: state.messages,
    isSidebarOpen: state.isSidebarOpen,
    addMessage,
    setMessages,
    clearMessages,
    setSidebarOpen,
    toggleSidebar
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};