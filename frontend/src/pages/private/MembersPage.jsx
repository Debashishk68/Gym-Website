import React, { useState } from "react";
import Navbar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import MemberCard from "../../components/MemberCard";
import SectionHeader from "../../components/SectionHeader";

const dummyMembers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", active: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321", active: false },
  { id: 3, name: "Rohit Kumar", email: "rohit@gym.com", phone: "9977665544", active: true },
  { id: 4, name: "Meena Sharma", email: "meena@fit.com", phone: "8877665544", active: true },
];

const MembersPage = () => {
  const [members] = useState(dummyMembers);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

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
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
