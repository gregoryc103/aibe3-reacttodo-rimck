import { useState } from 'react';
import { useTeamContext } from '../contexts/TeamContext';

const TeamMemberModal = ({ isOpen, onClose, member = null }) => {
  const { addTeamMember, updateTeamMember } = useTeamContext();
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'member',
    color: member?.color || '#3b82f6'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      if (member) {
        updateTeamMember(member.id, formData);
      } else {
        addTeamMember(formData);
      }
      setFormData({ name: '', email: '', role: 'member', color: '#3b82f6' });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-white border-4 border-wood-brown w-full max-w-md">
        <div className="bg-wood-brown text-cream p-4 border-b-2 border-wood-dark">
          <h3 className="text-lg font-bold uppercase">
            {member ? 'EDIT MEMBER' : 'ADD MEMBER'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-wood-brown mb-2 uppercase">
              NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-wood-brown focus:outline-none focus:ring-2 focus:ring-wood-light"
              placeholder="Enter member name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-wood-brown mb-2 uppercase">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-wood-brown focus:outline-none focus:ring-2 focus:ring-wood-light"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-wood-brown mb-2 uppercase">
              ROLE
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-wood-brown focus:outline-none focus:ring-2 focus:ring-wood-light"
            >
              <option value="member">MEMBER</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-wood-brown mb-2 uppercase">
              COLOR
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-12 border-2 border-wood-brown cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-wood-brown text-wood-brown bg-white hover:bg-gray-100 transition-colors uppercase font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-wood-brown text-cream border-2 border-wood-dark hover:bg-wood-dark transition-colors uppercase font-bold"
            >
              {member ? 'UPDATE' : 'ADD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamMemberModal;