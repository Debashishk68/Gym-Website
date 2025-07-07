const Navbar = () => {
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold tracking-wide text-yellow-400">
        GOLD'S GYM ADMIN
      </div>
      <ul className="flex space-x-6 text-sm font-medium">
        <li>Dashboard</li>
        <li>Members</li>
        <li>Stats</li>
        <li>Certificates</li>
        <li>Logout</li>
      </ul>
    </nav>
  );
};

export default Navbar;
