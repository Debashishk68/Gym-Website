import React, { useState } from "react";
import Navbar from "../../components/NavBar";

const dietData = [
  {
    image:
      "https://res.cloudinary.com/docvtawpy/image/upload/v1753516703/diet_chart_p62t5q.jpg",
    title: "Morning Meal",
  },
  {
    image:
      "https://res.cloudinary.com/docvtawpy/image/upload/v1753516701/diet_czkk9r.jpg",
    title: "Post-Workout",
  },
  {
    image:
      "https://res.cloudinary.com/docvtawpy/image/upload/v1753516698/weight-gain_ur2kil.jpg",
    title: "Lunch Plan",
  },
  {
    image:
      "https://res.cloudinary.com/docvtawpy/image/upload/v1753516708/dietplan_jrzmfx.jpg",
    title: "Dinner Plan",
  },
];

const DietPlan = () => {
  const [search, setSearch] = useState("");

  // Filter data based on search term
  const filteredData = dietData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0e1c14] min-h-screen text-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="px-6 md:px-12 py-12">
        <h1 className="text-4xl font-extrabold mb-6 text-green-300">Your Diet Plan</h1>

        {/* Search Input */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search meal plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[60%] px-6 py-3 rounded-xl bg-[#1a2c21] text-white placeholder:text-gray-400 border border-[#2a3d32] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* Diet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden h-fit bg-[#1f2e25]/70 border border-[#2c3f34] backdrop-blur-md shadow-xl hover:scale-[1.03] transition duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-fit object-cover"
                />
                <div className="p-4 text-lg font-semibold text-green-100">
                  {item.title}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              No results found for "<span className="text-green-300">{search}</span>"
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm py-8 border-t border-[#2c3f34]">
        <div className="flex justify-center gap-6 mb-3 flex-wrap">
          <span className="hover:text-green-300 cursor-pointer">About</span>
          <span className="hover:text-green-300 cursor-pointer">Contact</span>
          <span className="hover:text-green-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-green-300 cursor-pointer">Terms of Service</span>
        </div>
        <p className="text-xs text-gray-500">©2024 FitLife. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DietPlan;
