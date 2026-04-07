"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { deleteCookie } from "cookies-next/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Home, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavMenuProps {
  name: string;
  role: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ name, role }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = useMemo(() => {
    const items = [
      { label: "Home", href: "/", icon: <Home size={16} /> },
      
      { label: "Profile", href: "/profile", icon: <User size={16} /> },
    ];

    const dashboardRoles = ["teachers", "assistants", "admin"];
    if (dashboardRoles.includes(role.toLowerCase())) {
      items.push({ label: "Dashboard", href: "/dash", icon: <LayoutDashboard size={16} /> });
    }

    return items;
  }, [role]);

  const handleLogout = () => {
    deleteCookie("dataRoleToken", { path: "/" });
    deleteCookie("UserDe", { path: "/" });
    setOpen(false);
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 group focus:outline-none"
      >
        <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors text-sm">
          {name.split(" ")[0]} 
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-600" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 p-1.5"
          >
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Account Management
            </div>
            
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-sm font-medium mb-0.5 group"
              >
                <span className="text-slate-400 group-hover:text-indigo-500">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <div className="my-1 border-t border-slate-50" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavMenu;