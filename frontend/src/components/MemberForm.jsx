import React from "react";

const MemberForm = () => {
  return (
    <form className="bg-[#111] p-6 rounded-xl text-white border border-yellow-400 space-y-4 w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-2">Add New Member</h3>
      <input type="text" placeholder="Full Name" className="input" />
      <input type="email" placeholder="Email" className="input" />
      <input type="tel" placeholder="Phone Number" className="input" />
      <select className="input">
        <option>Select Subscription</option>
        <option>1 Month</option>
        <option>3 Months</option>
        <option>6 Months</option>
      </select>
      <button className="w-full py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition">Add Member</button>
    </form>
  );
};
export default MemberForm;
