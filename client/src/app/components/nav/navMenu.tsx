"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { deleteCookie } from "cookies-next/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Home, LogOut, Settings } from "lucide-react";

interface NavMenuProps {
  name: string;
  role: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ name, role }) => {
  const [open, setOpen] = useState(false);

  const menuItems = useMemo(() => {
    const items = [
      { label: "Home", href: "/", icon: <Home size={16} /> },
      { label: "Profile", href: "/profile", icon: <User size={16} /> },
    ];

    if (role === "teachers" || role === "assistants") {
      items.push({ label: "Dashboard", href: "/dash", icon: <Settings size={16} /> });
    }

    return items;
  }, [role]); 

  const handleLogout = () => {
    deleteCookie("dataRoleToken");
    deleteCookie("UserDe");
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 group focus:outline-none"
      >
        <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
          {name.split(" ")[0]} 
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-600" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50 p-2"
            >
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Menu
              </div>
              
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium mb-0.5"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <hr className="my-1 border-slate-50" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavMenu;