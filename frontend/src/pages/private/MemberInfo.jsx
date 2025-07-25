import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiMail,
  HiPhone,
  HiUser,
  HiUserGroup,
  HiHome,
} from "react-icons/hi";

import Navbar from "../../components/NavBar";
import Loading from "../../components/Loader";
import { useMembersInfo } from "../../hooks/useDashboard";
import { useIdCard } from "../../hooks/useCertificate";

dayjs.extend(relativeTime);

const MemberInfo = () => {
  const [member, setMember] = useState({});
  const { memberId } = useParams();
  const navigate = useNavigate();

  const { data, isSuccess, isLoading } = useMembersInfo(memberId);
  const { mutate: generateId, isPending, isSuccess: isIdSuccess } = useIdCard();

  useEffect(() => {
    if (isSuccess) {
      setMember(data.client);
    }
  }, [isSuccess, data]);

  const joinedDate = dayjs(member.joinedAt);
  const expiryDate = dayjs(member.membershipDeadline);
  const daysLeft = expiryDate.diff(dayjs(), "day");
  const isExpired = daysLeft < 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-sans">
      <Navbar />
      {isLoading && <Loading />}

      <div className="max-w-5xl mx-auto mt-10 p-6 rounded-xl shadow-lg bg-zinc-900/90 border border-yellow-400/30 backdrop-blur">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-8 sm:items-center justify-between">
          <div className="flex items-center gap-6">
            <img
              src={member.profilePic || "/default-avatar.png"}
              alt={member.fullname}
              className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-md object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="space-y-1 bg-zinc-800/70 p-4 rounded-lg border border-yellow-500/20 shadow-inner">
              <h2 className="text-3xl font-bold text-yellow-300 tracking-wide">
                {member.fullname || "Loading..."}
              </h2>
              <p className="text-sm flex items-center gap-2 text-gray-300">
                <HiUser className="text-yellow-400" /> Father’s Name:{" "}
                <span className="font-medium text-white">
                  {member.fathersname}
                </span>
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-300">
                <HiMail className="text-yellow-400" /> {member.email}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-300">
                <HiPhone className="text-yellow-400" /> {member.phone}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-300">
                <HiUserGroup className="text-yellow-400" /> Emergency:{" "}
                {member.emergencyContact}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => generateId(memberId)}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-md font-semibold shadow-md transition-all duration-200"
            >
              {isPending ? "Generating..." : "Generate ID"}
            </button>
            <button
              onClick={() => navigate(`/edit-profile/${memberId}`)}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 rounded-md font-semibold shadow-md transition-all duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {isIdSuccess && (
          <div className="mt-4 text-green-400 font-medium">
            ✅ ID generated successfully!
          </div>
        )}

        {/* Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[
            {
              label: "Membership Type",
              value: member.plan,
            },
            {
              label: "Joined On",
              value: joinedDate.isValid() ? joinedDate.format("MMMM D, YYYY") : "-",
            },
            {
              label: "Membership Deadline",
              value: expiryDate.isValid() ? expiryDate.format("MMMM D, YYYY") : "-",
              badge: isExpired ? (
                <span className="text-red-300">
                  Expired {Math.abs(daysLeft)} days ago
                </span>
              ) : (
                <span className="text-green-300">{daysLeft} days left</span>
              ),
              color: isExpired ? "bg-red-700" : "bg-green-700",
            },
            {
              label: "Payment Status",
              value: (
                <span
                  className={`px-2 py-1 rounded-md text-sm font-semibold 
                    ${
                      member.status === "Active"
                        ? "bg-green-700 text-green-300"
                        : "bg-red-700 text-red-300"
                    }`}
                >
                  {member.status}
                </span>
              ),
            },
            {
              label: "Gender",
              value: member.gender,
            },
            {
              label: "Age",
              value: member.age ? `${member.age} years` : "-",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-5 rounded-lg border border-yellow-600/30 ${
                item.color || "bg-black/60"
              } hover:shadow-xl transition-shadow`}
            >
              <h3 className="text-md font-medium text-yellow-400 mb-1">
                {item.label}
              </h3>
              <p
                className={`text-lg font-semibold ${
                  typeof item.value === "string" ? "text-white" : ""
                }`}
              >
                {item.value}
              </p>
              {item.badge && (
                <p className="text-sm mt-1 font-medium">{item.badge}</p>
              )}
            </div>
          ))}

          {/* Address */}
          <div className="sm:col-span-2 lg:col-span-3 bg-black/60 p-5 rounded-lg border border-yellow-600/30 hover:shadow-xl transition-shadow">
            <h3 className="text-md font-medium text-yellow-400 mb-1 flex items-center gap-2">
              <HiHome className="text-yellow-400" />
              Address
            </h3>
            <p className="text-white">{member.address || "Not provided."}</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-yellow-300 transition"
          >
            ← Back to Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
