const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 text-center text-white flex flex-col items-center justify-center border border-yellow-500">
      <div className="text-4xl mb-3 text-yellow-400">{icon}</div>
      <h4 className="text-xl font-bold">{value}</h4>
      <p className="text-sm mt-1">{label}</p>
    </div>
  );
};

export default StatCard;
