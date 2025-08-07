// InactiveMembersPanel.jsx
import { X } from 'lucide-react';

const InactiveMembersPanel = ({
  show,
  onClose,
  inactiveMembers = [],
}) => {
    console.log(inactiveMembers)
  const totalAmountDue = inactiveMembers.reduce((sum, m) => sum + (m.planPrice || 0), 0);

  return (
    show && (
      <div className="fixed top-0 right-0 w-80 h-full bg-zinc-900 text-white z-50 shadow-lg border-l border-zinc-800 transition-transform duration-300 transform translate-x-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Inactive Members</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className="p-4 border-b border-zinc-700 text-sm text-gray-400">
          <p>Total Inactive: <span className="font-semibold text-white">{inactiveMembers.length}</span></p>
          <p>Total Due: <span className="font-semibold text-white">₹{totalAmountDue.toLocaleString()}</span></p>
        </div>

        {/* Members List */}
        <div className="overflow-y-auto p-4 space-y-3">
          {inactiveMembers.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center">No inactive users</p>
          ) : (
            inactiveMembers.map((user) => (
              <div key={user._id} className="p-3 border border-zinc-800 rounded-md bg-zinc-800/50">
                <p className="font-medium">{user.fullname}</p>
                <p className="text-sm text-zinc-400">{user.phone}</p>
                <p className="text-sm text-zinc-400">Deadline: {new Date(user.membershipDeadline).toLocaleDateString()}</p>
                <p className="text-sm text-red-400 font-semibold">Due: ₹{user.planPrice?.toLocaleString() || 0}</p>
              </div>
            ))
          )}
        </div>
      </div>
    )
  );
};

export default InactiveMembersPanel;
