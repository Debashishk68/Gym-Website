import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import MemberCard from "../../components/MemberCard";
import SectionHeader from "../../components/SectionHeader";
import { useMembers } from "../../hooks/useDashboard";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isSuccess, isError, error } = useMembers();

  useEffect(() => {
    if (isSuccess) {
      setMembers(data.clients);
    }
  }, [isSuccess]);

  const filtered = members.filter((m) => {
    const nameMatch = m.fullname
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const emailMatch = m.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const phoneMatch = m.phone?.toString().includes(searchTerm); // convert number to string if needed

    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <SectionHeader title="🏋️‍♂️ All Members" />

        <div className="mt-4 mb-8">
          <SearchBar onSearch={(q) => setSearchTerm(q)} />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400">No members found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
