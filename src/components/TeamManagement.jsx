import { useState } from 'react';
import { useTeamContext } from '../contexts/TeamContext';
import { useTodos } from '../hooks/useTodos';
import TeamMemberModal from './TeamMemberModal';

const TeamManagement = () => {
  const { members, deleteTeamMember } = useTeamContext();
  const { todos } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getMemberStats = (memberId) => {
    const memberTodos = todos.filter(todo => todo.assignedTo === memberId);
    const completed = memberTodos.filter(todo => todo.completed).length;
    const total = memberTodos.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, progress };
  };

  const handleDeleteMember = (id, name) => {
    if (confirm(`${name}을(를) 팀에서 제거하시겠습니까?`)) {
      deleteTeamMember(id);
    }
  };

  return (
    <div className="p-4 h-full">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase text-wood-brown mb-4">팀 멤버</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2 px-4 bg-wood-brown text-cream border-2 border-wood-dark uppercase font-bold hover:bg-wood-dark transition-colors"
        >
          멤버 추가
        </button>
      </div>

      {/* 팀 멤버 목록 */}
      <div className="space-y-3">
        {members.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">팀 멤버를 추가해주세요</p>
          </div>
        ) : (
          members.map(member => {
            const stats = getMemberStats(member.id);
            return (
              <div
                key={member.id}
                className="relative p-3 bg-gray-100 border-2 border-wood-brown"
              >
                {/* 제거 버튼 */}
                <button
                  onClick={() => handleDeleteMember(member.id, member.name)}
                  className="absolute top-1 right-1 w-6 h-6 bg-danger text-white text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  ×
                </button>

                {/* 멤버 정보 */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-4 h-4 border-2 border-wood-brown"
                      style={{ backgroundColor: member.color }}
                    ></div>
                    <span className="font-bold text-sm uppercase">{member.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{member.email}</p>
                </div>

                {/* 진행률 */}
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>완료: {stats.completed}/{stats.total}</span>
                    <span>{stats.progress}%</span>
                  </div>
                  <div className="bg-gray-300 h-2 border border-wood-brown">
                    <div 
                      className="bg-success h-full transition-all duration-300"
                      style={{ width: `${stats.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 팀 멤버 모달 */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TeamManagement;