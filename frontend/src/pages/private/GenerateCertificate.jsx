import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import { useMembers } from "../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import useCertificate from "../../hooks/useCertificate";

const GenerateCertificate = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [title, setTitle] = useState("Certificate of Achievement");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [weightcategory, setWeightCategory] = useState("75kg");
  const [weightlift, setWeightLift] = useState("180kg");
  const [place, setPlace] = useState("Dhanbad");

  const [selectedMember, setSelectedMember] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    mutate: certicateData,
    isSuccess,
    isPending,
    isError,
  } = useCertificate();

  const { data, isSuccess: isMembersLoaded } = useMembers();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMembersLoaded) {
      setMembers(data.clients);
    }
  }, [isMembersLoaded, data]);

  useEffect(() => {
    const member = members.find((m) => m._id === selectedMemberId);
    setSelectedMember(member || null);
    setErrorMessage("");
  }, [selectedMemberId, members]);

  const handleGenerate = () => {
    if (!selectedMemberId) {
      setErrorMessage("Please select a member.");
      return;
    }

    const dateRange = fromDate && toDate ? `${fromDate} to ${toDate}` : "";

    certicateData({
      name: selectedMember?.fullname,
      course: title,
      date: dateRange,
      weightcategory,
      weightlift,
      place,
    });
  };

  return (
    <div className="min-h-screen bg-[#0d181c] text-white">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">
            Generate Certificate
          </h1>
          <p className="text-sm text-gray-400">
            Easily generate and preview a certificate for any registered gym
            member.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Form */}
          <div className="space-y-6 bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-700">
            {errorMessage && (
              <div className="text-red-400 bg-red-800/20 border border-red-500/30 rounded-md px-4 py-2 text-sm">
                {errorMessage}
              </div>
            )}

            {isSuccess && (
              <div className="text-green-400 bg-green-800/20 border border-green-500/30 rounded-md px-4 py-2 text-sm">
                ✅ Certificate generated successfully!
              </div>
            )}

            {isError && (
              <div className="text-red-400 bg-red-800/20 border border-red-500/30 rounded-md px-4 py-2 text-sm">
                ❌ Something went wrong. Please try again.
              </div>
            )}

            {/* Select Member */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select Member
              </label>
              <select
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-yellow-300"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="">-- Select Member --</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.fullname}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Certificate Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                />
              </div>
            </div>

            {/* Weight Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Weight Category
              </label>
              <input
                type="text"
                value={weightcategory}
                onChange={(e) => setWeightCategory(e.target.value)}
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              />
            </div>

            {/* Weight Lift */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Weight Lift (kg)
              </label>
              <input
                type="text"
                value={weightlift}
                onChange={(e) => setWeightLift(e.target.value)}
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              />
            </div>

            {/* Place */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Place
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                className="px-5 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white transition"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-md bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition"
                onClick={handleGenerate}
              >
                {isPending ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Right Preview */}
          <div className="h-fit bg-gradient-to-tr from-yellow-900/20 via-zinc-800 to-black rounded-xl p-6 shadow-xl border border-yellow-700/20">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">
                {title || "Certificate Title"}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                This certificate is proudly presented to{" "}
                <span className="text-yellow-300 font-semibold">
                  {selectedMember?.fullname || "Member Name"}
                </span>{" "}
                for outstanding dedication and performance in{" "}
                <span className="text-yellow-400">{weightcategory}</span>{" "}
                category by lifting{" "}
                <span className="text-yellow-400">{weightlift}</span> at{" "}
                <span className="text-yellow-400">{place}</span> during the
                period from{" "}
                <span className="text-yellow-400">{fromDate || "..."}</span> to{" "}
                <span className="text-yellow-400">{toDate || "..."}</span>.
              </p>
              <p className="text-sm text-gray-500 mt-4 italic">
                ~ AB Fitness Gym
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCertificate;
