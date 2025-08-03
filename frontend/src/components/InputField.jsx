export const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  icon,
  type = "text",
}) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <div className="flex items-center gap-2 bg-zinc-800 border border-gray-600 rounded-lg px-3">
      {icon && <span className="text-yellow-400">{icon}</span>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent text-white outline-none"
      />
    </div>
    {error && <p className="text-red-400 text-sm">{error}</p>}
  </div>
);