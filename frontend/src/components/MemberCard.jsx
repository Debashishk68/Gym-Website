import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MemberCard = ({ member }) => {
  return (
    <div className="bg-zinc-900 border border-yellow-500/30 hover:border-yellow-400 transition-all p-5 rounded-xl shadow-lg space-y-3">
      <h3 className="text-xl font-semibold text-yellow-300">{member.name}</h3>
      <p className="text-sm text-gray-300">📧 {member.email}</p>
      <p className="text-sm text-gray-300">📞 {member.phone}</p>
      <div className="pt-2">
        <span
          className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${
            member.active
              ? "bg-green-600/20 text-green-300"
              : "bg-red-600/20 text-red-300"
          }`}
        >
          {member.active ? <FaCheckCircle /> : <FaTimesCircle />}
          {member.active ? "Active Member" : "Inactive Member"}
        </span>
      </div>
    </div>
  );
};

export default MemberCard;
