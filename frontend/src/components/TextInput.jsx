import React from 'react';

const TextInput = ({ label, type = "text", onChange,placeholder, error, registerProps }) => {
  return (
    <div className="w-full">
      <label className="block text-base font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...registerProps}
        onChange={onChange}
        className={`w-full h-14 px-4 rounded-lg border border-[#cee2e8] bg-[#f8fbfc] placeholder:text-[#49879c] text-[#0d181c] 
        focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 
        ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;
