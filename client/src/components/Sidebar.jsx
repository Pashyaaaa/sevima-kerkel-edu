import { NavLink, useNavigate } from "react-router-dom";
import { FileText, Users, Settings, LogOut, CheckCircle } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic clear token/session di sini
    navigate("/");
  };

  const navItems = [
    { name: "Tugas", path: "/tugas", icon: <FileText className="w-5 h-5" /> },
    { name: "Kelas", path: "/kelas", icon: <Users className="w-5 h-5" /> },
    {
      name: "Setting",
      path: "/setting",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-950 border-r border-gray-800 flex flex-col fixed left-0 top-0 z-40">
      {/* Sidebar Header / Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800/60 bg-gray-950">
        <CheckCircle className="w-7 h-7 text-emerald-400 mr-3" />
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Koreksi<span className="text-emerald-400">.</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Main Menu
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]"
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200 border border-transparent"
              }`
            }
          >
            <span className="mr-3 transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout Area */}
      <div className="p-4 border-t border-gray-800/60 bg-gray-900/30">
        <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-gray-900 border border-gray-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white mr-3 shadow-inner">
            S
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Siswa Demo</p>
            <p className="text-xs text-emerald-400 truncate">Online</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors group"
        >
          <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
