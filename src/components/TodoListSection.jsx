// src/components/TodoListSection.jsx
import React from 'react'
import TodoItem from './TodoItem'
import { useTodoContext } from '../TodoContext'

function TodoListSection({
  filteredTodos,
  handleCheck,
  handleComplete,
  handleRemove,
  priorities,
  getAssigneeInfo,
}) {
  // Context에서 직접 상태 가져오기 (props 대신)
  const { checkedIds } = useTodoContext()

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>표시할 할 일이 없습니다.</p>
        <p>새로운 할 일을 추가해보세요!</p>
      </div>
    )
  }

  return (
    <div>
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onCheck={handleCheck}
          onComplete={handleComplete}
          onRemove={handleRemove}
          priorities={priorities}
          getAssigneeInfo={getAssigneeInfo}
        />
      ))}
    </div>
  )
}

export default TodoListSection
