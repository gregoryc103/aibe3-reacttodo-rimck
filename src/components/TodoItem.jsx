// src/components/TodoItem.jsx
import React from 'react'
import { useTodoContext } from '../TodoContext'

function TodoItem({
  todo,
  onCheck,
  onComplete,
  onRemove,
  priorities,
  getAssigneeInfo,
}) {
  // Context에서 직접 상태 가져오기 (isChecked prop 대신)
  const { checkedIds } = useTodoContext()

  // isChecked를 직접 계산
  const isChecked = checkedIds.includes(todo.id)

  const assigneeInfo = getAssigneeInfo(todo.assignee)
  const priorityInfo = priorities[todo.priority]

  return (
    <div className={`flex items-center gap-3 p-3 border-b border-gray-200 ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onCheck(todo.id)}
        style={{ transform: 'scale(1.2)' }}
      />

      <div className="flex-1">
        <div className={`text-sm font-mono ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
          {todo.text}
        </div>
        <div className="flex gap-2 mt-2">
          {todo.assignee && (
            <span
              className="px-2 py-1 text-xs font-bold text-white rounded border border-wood-brown"
              style={{ backgroundColor: assigneeInfo.color }}
            >
              {assigneeInfo.name}
            </span>
          )}
          <span 
            className="px-2 py-1 text-xs font-bold text-white rounded border border-wood-brown"
            style={{ backgroundColor: priorityInfo.color }}
          >
            {priorityInfo.label}
          </span>
          {todo.completed && (
            <span className="px-2 py-1 text-xs font-bold text-white rounded border border-wood-brown bg-green-500">
              완료
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onComplete(todo.id)}
          className={`px-3 py-1 text-sm font-bold border-2 border-wood-brown cursor-pointer font-mono uppercase transition-colors ${
            todo.completed 
              ? 'bg-warning text-black hover:bg-yellow-600' 
              : 'bg-info text-black hover:bg-blue-600'
          }`}
        >
          {todo.completed ? '↩️' : '✅'}
        </button>
        <button
          onClick={() => onRemove(todo.id)}
          className="px-3 py-1 text-sm font-bold border-2 border-wood-brown bg-danger text-black cursor-pointer font-mono uppercase hover:bg-red-600 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default TodoItem
