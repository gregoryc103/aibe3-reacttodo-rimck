import { createContext, useContext, useReducer, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const TeamContext = createContext();

const teamReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEAM_MEMBERS':
      return {
        ...state,
        members: action.payload
      };
    case 'ADD_TEAM_MEMBER':
      return {
        ...state,
        members: [...state.members, action.payload]
      };
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.id ? { ...member, ...action.payload } : member
        )
      };
    case 'DELETE_TEAM_MEMBER':
      return {
        ...state,
        members: state.members.filter(member => member.id !== action.payload)
      };
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      return state;
  }
};

export const TeamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(teamReducer, {
    members: [],
    currentUser: null
  });

  // 컴포넌트 마운트 시 localStorage에서 팀 멤버 로드
  useEffect(() => {
    const savedMembers = localStorage.getItem('team-members');
    const savedCurrentUser = localStorage.getItem('current-user');
    
    if (savedMembers) {
      try {
        const decryptedMembers = CryptoJS.AES.decrypt(savedMembers, 'team-secret').toString(CryptoJS.enc.Utf8);
        const parsedMembers = JSON.parse(decryptedMembers);
        dispatch({ type: 'SET_TEAM_MEMBERS', payload: parsedMembers });
      } catch (error) {
        console.error('Failed to parse saved team members:', error);
      }
    }

    if (savedCurrentUser) {
      try {
        const parsedCurrentUser = JSON.parse(savedCurrentUser);
        dispatch({ type: 'SET_CURRENT_USER', payload: parsedCurrentUser });
      } catch (error) {
        console.error('Failed to parse saved current user:', error);
      }
    }
  }, []);

  // 팀 멤버 변경 시 localStorage에 암호화하여 저장
  useEffect(() => {
    if (state.members.length > 0) {
      const encryptedMembers = CryptoJS.AES.encrypt(JSON.stringify(state.members), 'team-secret').toString();
      localStorage.setItem('team-members', encryptedMembers);
    }
  }, [state.members]);

  // 현재 사용자 변경 시 localStorage에 저장
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('current-user', JSON.stringify(state.currentUser));
    }
  }, [state.currentUser]);

  const addTeamMember = (member) => {
    const newMember = {
      id: Date.now(),
      name: member.name,
      email: member.email,
      role: member.role || 'member',
      avatar: member.avatar || null,
      color: member.color || getRandomColor(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newMember });
  };

  const updateTeamMember = (id, updates) => {
    dispatch({ type: 'UPDATE_TEAM_MEMBER', payload: { id, ...updates } });
  };

  const deleteTeamMember = (id) => {
    dispatch({ type: 'DELETE_TEAM_MEMBER', payload: id });
  };

  const setCurrentUser = (user) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  const getRandomColor = () => {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
      '#ec4899', '#f43f5e'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getMemberById = (id) => {
    return state.members.find(member => member.id === id);
  };

  const getMemberStats = () => {
    return {
      total: state.members.length,
      admins: state.members.filter(member => member.role === 'admin').length,
      members: state.members.filter(member => member.role === 'member').length
    };
  };

  const value = {
    members: state.members,
    currentUser: state.currentUser,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    setCurrentUser,
    getMemberById,
    getMemberStats
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
};