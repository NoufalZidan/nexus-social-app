import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineBell } from "react-icons/ai";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-slate-800">Nexus</h1>
      </div>

      <div className="mb-4 px-2">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
          <AiOutlineSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-700 w-full"
          />
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 text-slate-700 transition"
        >
          <AiOutlineHome className="text-xl" />
          <span className="font-medium">Home</span>
        </Link>

        <Link
          to="/notifications"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 text-slate-700 transition"
        >
          <AiOutlineBell className="text-xl" />
          <span className="font-medium">Notifications</span>
        </Link>

        <button
          onClick={onCreatePost}
          className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-slate-100 text-slate-700 transition w-full"
        >
          <AiOutlinePlusSquare className="text-xl" />
          <span className="font-medium">Create Post</span>
        </button>

        <Link
          to={`/profile/${user?.id}`}
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 text-slate-700 transition"
        >
          <AiOutlineUser className="text-xl" />
          <span className="font-medium">Profile</span>
        </Link>
      </nav>

      <div className="flex items-center justify-between px-2 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-bold text-slate-600">
            {user?.user_metadata?.username?.[0].toUpperCase()}
          </div>
          <span className="text-sm text-slate-700 truncate w-28">
            {user?.user_metadata?.username ?? user?.email}
          </span>
        </div>
        <button onClick={handleLogout} className="text-slate-400 cursor-pointer hover:text-red-500 transition">
          <AiOutlineLogout className="text-xl" />
        </button>
      </div>
    </aside>
  );
};

export default Navbar;