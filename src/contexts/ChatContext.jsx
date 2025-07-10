import { createContext, useContext, useReducer, useEffect } from 'react';
import OpenAI from 'openai';

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
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    isSidebarOpen: false,
    isLoading: false
  });

  // OpenAI 클라이언트 초기화
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  // 컴포넌트 마운트 시 localStorage에서 메시지 로드
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        dispatch({ type: 'SET_MESSAGES', payload: parsedMessages });
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // 메시지 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(state.messages));
  }, [state.messages]);

  const addMessage = async (message) => {
    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      text: message.text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    // 로딩 상태 시작
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // OpenAI API 호출
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for a todo application. Help users manage their tasks and provide productivity tips. Respond in Korean.'
          },
          {
            role: 'user',
            content: message.text
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      // AI 응답 메시지 추가
      const aiMessage = {
        id: Date.now() + 1,
        text: response.choices[0].message.content,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // 오류 메시지 추가
      const errorMessage = {
        id: Date.now() + 1,
        text: '죄송합니다. 현재 채팅 서비스에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    } finally {
      // 로딩 상태 종료
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setMessages = (messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    localStorage.removeItem('chat-messages');
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
    isLoading: state.isLoading,
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