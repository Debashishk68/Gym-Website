export const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-200 mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 text-sm sm:text-base rounded-lg bg-zinc-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 ease-in-out appearance-none"
      >
        {options.map((opt, i) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val + i} value={val} className="bg-zinc-800 text-white">
              {label}
            </option>
          );
        })}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);
