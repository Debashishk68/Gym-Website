import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Navbar from "../../components/NavBar";

dayjs.extend(relativeTime);

const MemberInfo = ({ member }) => {
  // Temporary data (replace with Redux or API state)
  member = member || {
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    gender: "Male",
    age: 28,
    address: "123 Fitness Lane, Kolkata",
    membershipType: "Gold",
    joinedOn: "2024-08-01",
    subscriptionExpires: "2025-08-01",
    paymentStatus: "Paid",
    profileImage: "https://i.pravatar.cc/150?img=68",
  };

  const joinedDate = dayjs(member.joinedOn);
  const expiryDate = dayjs(member.subscriptionExpires);
  const daysLeft = expiryDate.diff(dayjs(), "day");
  const isExpired = daysLeft < 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
              <Navbar />

      <div className="max-w-5xl mt-6 mx-auto bg-zinc-900/90 rounded-xl shadow-xl p-6 space-y-10 border border-yellow-400/20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-6">
            <img
              src={member.profileImage}
              alt={member.name}
              className="w-28 h-28 rounded-full border-4 border-yellow-400 object-cover"
            />
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-yellow-300">{member.name}</h2>
              <p className="text-sm text-gray-300">Email: {member.email}</p>
              <p className="text-sm text-gray-300">Phone: {member.phone}</p>
            </div>
          </div>

          <button className="mt-4 sm:mt-0 bg-yellow-400 text-black px-5 py-2 rounded-lg font-medium hover:bg-yellow-300 transition">
            Edit Profile
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black/60 p-5 rounded-lg border border-yellow-600/30">
            <h3 className="text-md text-yellow-400 font-medium mb-1">Membership Type</h3>
            <p className="text-white text-lg">{member.membershipType}</p>
          </div>

          <div className="bg-black/60 p-5 rounded-lg border border-yellow-600/30">
            <h3 className="text-md text-yellow-400 font-medium mb-1">Joined On</h3>
            <p className="text-white text-lg">{joinedDate.format("MMMM D, YYYY")}</p>
          </div>

          <div className={`p-5 rounded-lg ${isExpired ? "bg-red-700" : "bg-green-700"} border border-yellow-500/20`}>
            <h3 className="text-md text-white font-medium mb-1">Membership Deadline</h3>
            <p className="text-yellow-200 text-lg">
              {expiryDate.format("MMMM D, YYYY")}
            </p>
            <p className="text-sm mt-1">
              {isExpired ? (
                <span className="text-red-100">Expired {Math.abs(daysLeft)} days ago</span>
              ) : (
                <span className="text-green-200">{daysLeft} days left</span>
              )}
            </p>
          </div>

          <div className="bg-black/60 p-5 rounded-lg border border-yellow-600/30">
            <h3 className="text-md text-yellow-400 font-medium mb-1">Payment Status</h3>
            <p className={`text-lg ${member.paymentStatus === "Paid" ? "text-green-400" : "text-red-400"}`}>
              {member.paymentStatus}
            </p>
          </div>

          <div className="bg-black/60 p-5 rounded-lg border border-yellow-600/30">
            <h3 className="text-md text-yellow-400 font-medium mb-1">Gender</h3>
            <p className="text-white text-lg">{member.gender}</p>
          </div>

          <div className="bg-black/60 p-5 rounded-lg border border-yellow-600/30">
            <h3 className="text-md text-yellow-400 font-medium mb-1">Age</h3>
            <p className="text-white text-lg">{member.age} years</p>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 bg-black/60 p-5 rounded-lg border border-yellow-600/30">
            <h3 className="text-md text-yellow-400 font-medium mb-1">Address</h3>
            <p className="text-white">{member.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
