const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by name, email or phone..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full max-w-md px-4 py-3 rounded-lg bg-black text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    />
  );
};

export default SearchBar;
