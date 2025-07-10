// src/App.jsx
import React, { useState, useRef } from 'react'
import useTodos from './hooks/useTodos'
import TodoListSection from './components/TodoListSection'
import TodoWriteForm from './components/TodoWriteForm'
import ChatSidebar from './components/ChatSidebar'
import { useTodoContext } from './TodoContext'

function App() {
  // Context에서 전역 상태 가져오기
  const {
    todos,
    teamMembers,
    setTeamMembers,
    checkedIds,
    selectedAssignee,
    setSelectedAssignee,
    filterAssignee,
    setFilterAssignee,
    filterStatus,
    setFilterStatus,
    nextMemberId,
  } = useTodoContext()

  // todos 관련 커스텀 훅 사용
  const {
    handleSubmit: todoHandleSubmit,
    handleChange,
    handleKeyPress: todoHandleKeyPress,
    handleCheck,
    handleToggleAll: todoHandleToggleAll,
    handleComplete,
    handleRemove,
    handleBulkComplete,
    handleBulkRemove,
    updateTodosOnMemberRemove,
    getFilteredTodos,
    getOverallProgress,
    getSelectedStatus,
  } = useTodos()

  // App.jsx에서 직접 관리하는 상태들 (팀 멤버 관련)
  const colorPalette = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
  ]

  const priorities = {
    high: { label: '높음', color: '#FF6B6B' },
    medium: { label: '보통', color: '#FFD93D' },
    low: { label: '낮음', color: '#6BCF7F' },
  }

  const [memberName, setMemberName] = useState('')
  const [isAddingMember, setIsAddingMember] = useState(false)

  const memberInputRef = useRef()

  // App.jsx의 팀 멤버 관련 함수들
  const handleAddMember = () => {
    if (!memberName.trim()) {
      alert('팀원 이름을 입력해주세요.')
      memberInputRef.current?.focus()
      return
    }

    if (teamMembers.some((member) => member.name === memberName.trim())) {
      alert('이미 존재하는 팀원 이름입니다.')
      memberInputRef.current?.focus()
      return
    }

    const newMember = {
      id: nextMemberId.current,
      name: memberName.trim(),
      color: colorPalette[(nextMemberId.current - 1) % colorPalette.length],
    }

    setTeamMembers([...teamMembers, newMember])

    // Context에서 가져온 setSelectedAssignee 직접 사용
    if (teamMembers.length === 0) {
      setSelectedAssignee(newMember.name)
    }

    setMemberName('')
    setIsAddingMember(false)
    nextMemberId.current += 1
  }

  const handleRemoveMember = (memberId) => {
    const memberToRemove = teamMembers.find((member) => member.id === memberId)

    if (!memberToRemove) return

    const assignedTodos = todos.filter(
      (todo) => todo.assignee === memberToRemove.name
    )

    if (assignedTodos.length > 0) {
      const confirmRemove = window.confirm(
        `${memberToRemove.name}님에게 할당된 할 일이 ${assignedTodos.length}개 있습니다. 정말 제거하시겠습니까?`
      )
      if (!confirmRemove) return
    }

    const updatedMembers = teamMembers.filter(
      (member) => member.id !== memberId
    )
    setTeamMembers(updatedMembers)

    // Context에서 가져온 selectedAssignee, setSelectedAssignee 직접 사용
    if (selectedAssignee === memberToRemove.name) {
      setSelectedAssignee(
        updatedMembers.length > 0 ? updatedMembers[0].name : ''
      )
    }

    if (filterAssignee === memberToRemove.name) {
      setFilterAssignee('all')
    }

    // 커스텀 훅의 함수 호출
    updateTodosOnMemberRemove(memberToRemove.name)
  }

  const handleMemberNameChange = (e) => {
    setMemberName(e.target.value)
  }

  const handleMemberKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddMember()
    }
  }

  // 커스텀 훅 함수들을 App 컨텍스트에 맞게 래핑
  const handleSubmit = () => {
    todoHandleSubmit()
  }

  const handleKeyPress = (e) => {
    todoHandleKeyPress(e)
  }

  const handleToggleAll = () => {
    const filteredTodos = getFilteredTodos(filterAssignee, filterStatus)
    todoHandleToggleAll(filteredTodos)
  }

  // App.jsx의 유틸리티 함수들
  const getAssigneeInfo = (assigneeName) => {
    return (
      teamMembers.find((member) => member.name === assigneeName) || {
        name: assigneeName,
        color: '#999',
      }
    )
  }

  const getTeamStats = () => {
    const stats = {}
    teamMembers.forEach((member) => {
      const memberTodos = todos.filter((todo) => todo.assignee === member.name)
      const completedTodos = memberTodos.filter((todo) => todo.completed)
      stats[member.name] = {
        total: memberTodos.length,
        completed: completedTodos.length,
        percentage:
          memberTodos.length > 0
            ? Math.round((completedTodos.length / memberTodos.length) * 100)
            : 0,
      }
    })
    return stats
  }

  // 계산된 값들
  const filteredTodos = getFilteredTodos(filterAssignee, filterStatus)
  const teamStats = getTeamStats()
  const overallProgress = getOverallProgress()
  const selectedStatus = getSelectedStatus()

  return (
    <div className="flex h-screen border-4 border-wood-brown box-border">
      {/* 왼쪽 사이드바 - 팀 멤버 관리 */}
      <div className="w-80 bg-white border-r-4 border-wood-brown overflow-y-auto">
        <div className="h-full p-4">
          <h3 className="text-base font-bold mb-4 text-wood-brown uppercase">TEAM MEMBERS</h3>

          {teamMembers.length === 0 ? (
            <div className="text-center py-5 text-gray-500 text-sm">
              <p>팀 멤버를 추가해주세요.</p>
              <p>팀 멤버가 있어야 할 일을 생성할 수 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-3 bg-gray-100 border-2 border-wood-brown relative">
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="absolute top-1 right-1 bg-danger text-white border border-wood-brown w-5 h-5 text-xs cursor-pointer flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="멤버 제거"
                  >
                    ×
                  </button>
                  <div className="text-sm font-bold mb-1 text-black">
                    {member.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    완료: {teamStats[member.name]?.completed || 0}/
                    {teamStats[member.name]?.total || 0}
                  </div>
                  <div className="text-xs text-gray-600">
                    진행률: {teamStats[member.name]?.percentage || 0}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 팀 멤버 추가 */}
          <div className="mt-4">
            {isAddingMember ? (
              <div className="space-y-2">
                <input
                  ref={memberInputRef}
                  type="text"
                  value={memberName}
                  onChange={handleMemberNameChange}
                  onKeyPress={handleMemberKeyPress}
                  placeholder="팀원 이름을 입력하세요..."
                  className="w-full p-2 text-sm border-2 border-wood-brown bg-white font-mono box-border focus:outline-none focus:ring-2 focus:ring-wood-brown"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleAddMember} className="flex-1 px-3 py-2 text-sm font-bold border-2 border-wood-brown bg-success text-black cursor-pointer font-mono uppercase hover:bg-green-600 transition-colors">
                    ADD
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingMember(false)
                      setMemberName('')
                    }}
                    className="flex-1 px-3 py-2 text-sm font-bold border-2 border-wood-brown bg-danger text-black cursor-pointer font-mono uppercase hover:bg-red-600 transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingMember(true)}
                className="w-full px-4 py-2 text-sm font-bold border-2 border-wood-brown cursor-pointer font-mono uppercase transition-colors bg-info text-black hover:bg-blue-600"
              >
                ADD TEAM MEMBER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 mr-96 p-5 font-mono bg-cream flex flex-col">
        {/* 헤더 */}
        <div className="text-center mb-8 p-4 bg-wood-brown text-cream border-2 border-wood-dark">
          <h1 className="text-2xl font-bold m-0 mb-1 uppercase">TODO MANAGER</h1>
          <p className="text-xs m-0">Team5 주도하세영</p>
        </div>

        {/* 전체 진행률 */}
        {todos.length > 0 && (
          <div className="mb-5 p-4 bg-white border-2 border-wood-brown">
            <h3 className="text-base font-bold mb-4 text-wood-brown uppercase">OVERALL PROGRESS</h3>
            <div className="w-full h-8 bg-gray-300 border-2 border-wood-brown relative mb-2">
              <div
                className="h-full bg-success transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-black">
                {overallProgress}% (
                {todos.filter((todo) => todo.completed).length}/{todos.length})
              </div>
            </div>
          </div>
        )}

        {/* 할 일 추가 폼 컴포넌트 */}
        <TodoWriteForm
          handleChange={handleChange}
          handleKeyPress={handleKeyPress}
          handleSubmit={handleSubmit}
          teamMembers={teamMembers}
          priorities={priorities}
        />

        {/* 필터 및 할 일 목록 (팀 멤버가 있을 때만 표시) */}
        {teamMembers.length > 0 && (
          <>
            {/* 필터 */}
            <div className="mb-5 p-4 bg-white border-2 border-wood-brown">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-wood-brown">
                      담당자
                    </label>
                    <select
                      value={filterAssignee}
                      onChange={(e) => setFilterAssignee(e.target.value)}
                      className="p-2 border-2 border-wood-brown bg-white text-sm font-mono min-w-30 focus:outline-none focus:ring-2 focus:ring-wood-brown"
                    >
                      <option value="all">전체</option>
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-wood-brown">
                      상태
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="p-2 border-2 border-wood-brown bg-white text-sm font-mono min-w-30 focus:outline-none focus:ring-2 focus:ring-wood-brown"
                    >
                      <option value="all">전체</option>
                      <option value="incomplete">미완료</option>
                      <option value="completed">완료</option>
                    </select>
                  </div>
                </div>

                {filteredTodos.length > 0 && (
                  <div className="flex gap-4 items-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredTodos.length > 0 &&
                        checkedIds.length === filteredTodos.length
                      }
                      onChange={handleToggleAll}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span className="text-xs font-bold text-wood-brown">
                      전체 선택 ({checkedIds.length}/{filteredTodos.length})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 일괄 작업 */}
            {checkedIds.length > 0 && (
              <div className="p-4 bg-orange-100 border-2 border-wood-brown mb-5">
                <div className="mb-2 text-sm font-bold">
                  {checkedIds.length}개 항목이 선택되었습니다.
                </div>
                <button
                  onClick={handleBulkComplete}
                  className="px-5 py-2 text-sm font-bold border-2 border-wood-brown bg-warning text-black cursor-pointer font-mono uppercase hover:bg-yellow-600 transition-colors mr-2"
                >
                  {selectedStatus === 'allCompleted'
                    ? 'MARK INCOMPLETE'
                    : selectedStatus === 'allIncomplete'
                    ? 'MARK COMPLETE'
                    : 'MARK ALL COMPLETE'}
                </button>
                <button
                  onClick={handleBulkRemove}
                  className="px-5 py-2 text-sm font-bold border-2 border-wood-brown bg-danger text-black cursor-pointer font-mono uppercase hover:bg-red-600 transition-colors"
                >
                  DELETE
                </button>
              </div>
            )}

            {/* 할 일 목록 컴포넌트 - 스크롤 영역 */}
            <div className="flex-1 border-2 border-wood-brown bg-white overflow-hidden">
              <div className="h-full overflow-y-auto">
                <TodoListSection
                  filteredTodos={filteredTodos}
                  handleCheck={handleCheck}
                  handleComplete={handleComplete}
                  handleRemove={handleRemove}
                  priorities={priorities}
                  getAssigneeInfo={getAssigneeInfo}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🤖 AI 채팅 사이드바 */}
      <ChatSidebar teamMembers={teamMembers} />
    </div>
  )
}

export default App