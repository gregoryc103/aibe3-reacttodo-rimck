// src/TodoContext.jsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

// Context 생성
const TodoContext = createContext()

// Provider 컴포넌트
export function TodoProvider({ children }) {
  // 전역으로 관리할 상태들
  const [todos, setTodos] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [inputText, setInputText] = useState('')
  const [checkedIds, setCheckedIds] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 추가 전역 상태 (필요한 것만 선별)
  const [selectedAssignee, setSelectedAssignee] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('medium')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // ref는 전역에서 관리 (컴포넌트 간 공유 필요)
  const nextId = useRef(1)
  const nextMemberId = useRef(1)
  const inputRef = useRef()

  // localStorage에서 데이터 로드
  useEffect(() => {
    console.log('Loading data from localStorage...')
    
    // todos 로드
    const savedTodos = localStorage.getItem('todoagent_todos')
    console.log('savedTodos:', savedTodos)
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos)
        console.log('parsed todos:', parsedTodos)
        setTodos(parsedTodos)
        // nextId 업데이트
        if (parsedTodos.length > 0) {
          const maxId = Math.max(...parsedTodos.map(todo => todo.id))
          nextId.current = maxId + 1
        }
      } catch (error) {
        console.error('Failed to parse saved todos:', error)
      }
    }

    // teamMembers 로드
    const savedTeamMembers = localStorage.getItem('todoagent_team_members')
    console.log('savedTeamMembers:', savedTeamMembers)
    if (savedTeamMembers) {
      try {
        const parsedTeamMembers = JSON.parse(savedTeamMembers)
        console.log('parsed teamMembers:', parsedTeamMembers)
        setTeamMembers(parsedTeamMembers)
        // nextMemberId 업데이트
        if (parsedTeamMembers.length > 0) {
          const maxId = Math.max(...parsedTeamMembers.map(member => member.id))
          nextMemberId.current = maxId + 1
        }
        // 첫 번째 팀멤버를 selectedAssignee로 설정
        if (parsedTeamMembers.length > 0) {
          setSelectedAssignee(parsedTeamMembers[0].name)
        }
      } catch (error) {
        console.error('Failed to parse saved team members:', error)
      }
    }
    
    // 로딩 완료 표시
    setIsLoaded(true)
  }, [])

  // todos 변경 시 localStorage에 저장
  useEffect(() => {
    console.log('todos changed:', todos)
    if (isLoaded && todos.length > 0) {
      localStorage.setItem('todoagent_todos', JSON.stringify(todos))
      console.log('saved todos to localStorage')
    }
  }, [todos, isLoaded])

  // teamMembers 변경 시 localStorage에 저장
  useEffect(() => {
    console.log('teamMembers changed:', teamMembers)
    // 로딩 완료 후에만 저장
    if (isLoaded) {
      localStorage.setItem('todoagent_team_members', JSON.stringify(teamMembers))
      console.log('saved teamMembers to localStorage')
    }
  }, [teamMembers, isLoaded])

  // Context에서 제공할 값들
  const value = {
    // 상태
    todos,
    setTodos,
    teamMembers,
    setTeamMembers,
    inputText,
    setInputText,
    checkedIds,
    setCheckedIds,
    selectedAssignee,
    setSelectedAssignee,
    selectedPriority,
    setSelectedPriority,
    filterAssignee,
    setFilterAssignee,
    filterStatus,
    setFilterStatus,

    // refs
    nextId,
    nextMemberId,
    inputRef,
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

// Context 사용을 위한 커스텀 훅
export function useTodoContext() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider')
  }
  return context
}

export default TodoContext
