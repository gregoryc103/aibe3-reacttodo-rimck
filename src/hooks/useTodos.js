// src/hooks/useTodos.js
import { useTodoContext } from '../TodoContext'

function useTodos() {
  // Context에서 상태와 setter 가져오기
  const {
    todos,
    setTodos,
    teamMembers,
    inputText,
    setInputText,
    checkedIds,
    setCheckedIds,
    selectedAssignee,
    selectedPriority,
    nextId,
    inputRef,
  } = useTodoContext()

  const handleChange = (e) => {
    setInputText(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!inputText.trim()) {
      alert('할 일을 입력해주세요.')
      inputRef.current?.focus()
      return
    }

    if (teamMembers.length === 0) {
      alert('팀 멤버를 먼저 추가해주세요.')
      return
    }

    if (checkedIds.length === 0) {
      // 신규 추가
      const newTodo = {
        id: nextId.current,
        text: inputText,
        completed: false,
        assignee: selectedAssignee,
        priority: selectedPriority,
      }
      setTodos([newTodo, ...todos])
      nextId.current += 1
    } else {
      // 다중 수정
      const updatedTodos = todos.map((todo) =>
        checkedIds.includes(todo.id)
          ? {
              ...todo,
              text: inputText,
              assignee: selectedAssignee,
              priority: selectedPriority,
            }
          : todo
      )
      setTodos(updatedTodos)
      setCheckedIds([])
    }

    setInputText('')
  }

  const handleCheck = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id))
    } else {
      setCheckedIds([...checkedIds, id])
    }
  }

  const handleToggleAll = (filteredTodos) => {
    if (checkedIds.length === filteredTodos.length) {
      setCheckedIds([])
    } else {
      setCheckedIds(filteredTodos.map((todo) => todo.id))
    }
  }

  const handleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleRemove = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id))
  }

  const handleBulkComplete = () => {
    if (checkedIds.length === 0) {
      alert('완료할 항목을 선택해주세요.')
      return
    }

    const selectedTodos = todos.filter((todo) => checkedIds.includes(todo.id))
    const completedCount = selectedTodos.filter((todo) => todo.completed).length
    const incompleteCount = selectedTodos.length - completedCount

    let message = ''
    let shouldComplete = true

    if (completedCount === selectedTodos.length) {
      // 모든 선택 항목이 완료됨 → 미완료로 변경
      message = `선택된 ${checkedIds.length}개의 항목을 미완료로 변경하시겠습니까?`
      shouldComplete = false
    } else if (incompleteCount === selectedTodos.length) {
      // 모든 선택 항목이 미완료 → 완료로 변경
      message = `선택된 ${checkedIds.length}개의 항목을 완료로 변경하시겠습니까?`
      shouldComplete = true
    } else {
      // 혼합 상태 → 모두 완료로 변경
      message = `선택된 ${checkedIds.length}개의 항목을 모두 완료로 변경하시겠습니까?`
      shouldComplete = true
    }

    const confirmComplete = window.confirm(message)
    if (confirmComplete) {
      setTodos(
        todos.map((todo) =>
          checkedIds.includes(todo.id)
            ? { ...todo, completed: shouldComplete }
            : todo
        )
      )
      setCheckedIds([])
    }
  }

  const handleBulkRemove = () => {
    if (checkedIds.length === 0) {
      alert('제거할 항목을 선택해주세요.')
      return
    }

    const confirmRemove = window.confirm(
      `선택된 ${checkedIds.length}개의 항목을 제거하시겠습니까?`
    )
    if (confirmRemove) {
      setTodos(todos.filter((todo) => !checkedIds.includes(todo.id)))
      setCheckedIds([])
    }
  }

  const updateTodosOnMemberRemove = (memberName) => {
    setTodos(todos.filter((todo) => todo.assignee !== memberName))
    setCheckedIds([])
  }

  const getFilteredTodos = (filterAssignee, filterStatus) => {
    let filtered = todos

    // 담당자 필터
    if (filterAssignee !== 'all') {
      filtered = filtered.filter((todo) => todo.assignee === filterAssignee)
    }

    // 완료 상태 필터
    if (filterStatus !== 'all') {
      filtered = filtered.filter((todo) => {
        if (filterStatus === 'completed') return todo.completed
        if (filterStatus === 'incomplete') return !todo.completed
        return true
      })
    }

    return filtered
  }

  const getOverallProgress = () => {
    const totalTodos = todos.length
    const completedTodos = todos.filter((todo) => todo.completed).length
    return totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
  }

  const getSelectedStatus = () => {
    if (checkedIds.length === 0) return null

    const selectedTodos = todos.filter((todo) => checkedIds.includes(todo.id))
    const completedCount = selectedTodos.filter((todo) => todo.completed).length
    const incompleteCount = selectedTodos.length - completedCount

    if (completedCount === selectedTodos.length) return 'allCompleted'
    if (incompleteCount === selectedTodos.length) return 'allIncomplete'
    return 'mixed'
  }

  return {
    todos,
    inputText,
    checkedIds,
    inputRef,
    setInputText,
    handleSubmit,
    handleChange,
    handleKeyPress,
    handleCheck,
    handleToggleAll,
    handleComplete,
    handleRemove,
    handleBulkComplete,
    handleBulkRemove,
    updateTodosOnMemberRemove,
    getFilteredTodos,
    getOverallProgress,
    getSelectedStatus,
  }
}

export default useTodos
