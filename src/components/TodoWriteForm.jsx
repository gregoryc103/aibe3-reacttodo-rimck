// src/components/TodoWriteForm.jsx
import React from 'react'
import { useTodoContext } from '../TodoContext'

function TodoWriteForm({
  handleChange,
  handleKeyPress,
  handleSubmit,
  teamMembers = [], // 기본값 추가
  priorities,
}) {
  // Context에서 직접 상태 가져오기 (props 대신)
  const {
    inputText,
    inputRef,
    checkedIds,
    selectedAssignee,
    setSelectedAssignee,
    selectedPriority,
    setSelectedPriority,
  } = useTodoContext()

  return (
    <div className="mb-5 p-4 bg-white border-2 border-wood-brown">
      <h3 className="text-base font-bold mb-4 text-wood-brown uppercase">ADD TODO</h3>
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="새로운 할 일을 입력하세요..."
        className="w-full p-2 text-sm border-2 border-wood-brown bg-white mb-2 font-mono box-border focus:outline-none focus:ring-2 focus:ring-wood-brown disabled:bg-gray-100 disabled:text-gray-400"
        disabled={teamMembers?.length === 0}
      />

      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-wood-brown">담당자</label>
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="p-2 border-2 border-wood-brown bg-white text-sm font-mono min-w-30 focus:outline-none focus:ring-2 focus:ring-wood-brown disabled:bg-gray-100 disabled:text-gray-400"
            disabled={teamMembers?.length === 0}
          >
            {teamMembers?.length === 0 ? (
              <option value="">팀 멤버를 먼저 추가하세요</option>
            ) : (
              teamMembers?.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-wood-brown">우선순위</label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="p-2 border-2 border-wood-brown bg-white text-sm font-mono min-w-30 focus:outline-none focus:ring-2 focus:ring-wood-brown disabled:bg-gray-100 disabled:text-gray-400"
            disabled={teamMembers?.length === 0}
          >
            {Object.entries(priorities || {}).map(([key, priority]) => (
              <option key={key} value={key}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`px-5 py-2 text-sm font-bold border-2 border-wood-brown cursor-pointer font-mono uppercase transition-colors ${
          teamMembers?.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : checkedIds?.length === 0
            ? 'bg-success text-black hover:bg-green-600'
            : 'bg-warning text-black hover:bg-yellow-600'
        }`}
        disabled={teamMembers?.length === 0}
      >
        {checkedIds?.length === 0
          ? 'ADD TODO'
          : `EDIT ${checkedIds?.length} ITEMS`}
      </button>
    </div>
  )
}

export default TodoWriteForm
