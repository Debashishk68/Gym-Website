import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import MemberCard from "../../components/MemberCard";
import SectionHeader from "../../components/SectionHeader";
import { useMembers } from "../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import LoaderBar from "../../components/Loader";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data, isSuccess, isError, error, isLoading } = useMembers();

  useEffect(() => {
    if (isSuccess) {
      setMembers(data.clients);
    }
  }, [isSuccess, data]);

  const filtered = members.filter((m) => {
    const nameMatch = m.fullname
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const emailMatch = m.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const phoneMatch = m.phone?.toString().includes(searchTerm);

    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Navbar />
      {isLoading && <LoaderBar />}

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SectionHeader title="🏋️‍♂️ All Members" />
          <button
            onClick={() => navigate("/add-member")}
            className="px-5 py-2 rounded-full border-2 border-amber-400 text-amber-400 font-semibold hover:bg-amber-400 hover:text-black transition duration-300 shadow-sm"
          >
            Add Member
          </button>
        </div>

        {/* Search */}
        <SearchBar onSearch={(q) => setSearchTerm(q)} />

        {/* Error State */}
        {isError && (
          <div className="text-center text-red-400 font-medium bg-red-800/20 py-4 px-6 rounded-lg border border-red-600/30">
            Failed to load members. Please try again later.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && !isError && (
          <p className="text-center text-gray-400 italic mt-10">
            😕 No members match your search.
          </p>
        )}

        {/* Member Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            {filtered.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
