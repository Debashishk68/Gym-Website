import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MemberCard = ({ member }) => {
  const navigate = useNavigate();
  const deadline = new Date(member.membershipDeadline);

  const isActive = deadline.getTime() > Date.now();

  return (
    <div
      onClick={() => {
        navigate(`/membersinfo/${member._id}`);
      }}
      className="bg-zinc-900 border border-yellow-500/30 hover:border-yellow-400 transition-all p-5 rounded-xl shadow-lg space-y-3"
    >
      <h3 className="text-xl font-semibold text-yellow-300">
        {member.fullname}
      </h3>
      <p className="text-sm text-gray-300">📧 {member.email}</p>
      <p className="text-sm text-gray-300">📞 {member.phone}</p>
      <div className="pt-2">
        <span
          className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${
            isActive
              ? "bg-green-600/20 text-green-300"
              : "bg-red-600/20 text-red-300"
          }`}
        >
          {isActive ? <FaCheckCircle /> : <FaTimesCircle />}
          {isActive ? "Active Member" : "Inactive Member"}
        </span>
      </div>
    </div>
  );
};

export default MemberCard;
