/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";
import { motion } from "framer-motion"; 
import { Users2, BookOpen, Crown, LayoutDashboard } from "lucide-react";

type AccessAsset = "students" | "parents" | "assistants" | "chapters" | "lessons" | "teachers" | "subscribe";

const NavDash = () => {
  const tokenRole = getCookie("dataRoleToken");
  const userDe = getCookie("UserDe");
  const pathname = usePathname();
  const [accessAssets, setAccessAssets] = useState<AccessAsset[]>([]);

  useEffect(() => {
    async function checkAndRedirect() {
      if (!tokenRole || !userDe) return;
      const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);
      try {
        const decodedToken: any = await jwtVerify(tokenRole as string, SECRET);
        const userDeDecodedToken: any = await jwtVerify(userDe as string, SECRET);
        const userRole = decodedToken.payload.user.role;
        const allowedAccess = userDeDecodedToken.payload.roleData.access || [];

        if (userRole === "teachers") {
          setAccessAssets(["students", "parents", "assistants", "chapters", "lessons", "teachers"] as AccessAsset[]);
        } else {
          setAccessAssets(allowedAccess);
        }
      } catch (error) { console.error(error); }
    }
    checkAndRedirect();
  }, [tokenRole, userDe]);

  const navItems = [
    {
      id: "users",
      label: "Users",
      href: "/dash?user=student",
      icon: <Users2 size={18} />,
      show: accessAssets.some(a => ["students", "parents", "assistants"].includes(a)),
      active: pathname === "/dash"
    },
    {
      id: "chapters",
      label: "Chapters",
      href: "/dash/chapters",
      icon: <BookOpen size={18} />,
      show: accessAssets.includes("chapters"),
      active: pathname === "/dash/chapters"
    },
    {
      id: "sub",
      label: "Subscriptions",
      href: "/dash/sub?user=lesson",
      icon: <Crown size={18} />,
      show: accessAssets.includes("lessons") || accessAssets.includes("teachers") || accessAssets.includes("subscribe"),
      active: pathname === "/dash/sub"
    }
  ];

  return (
    <nav className="w-full flex justify-center items-center py-6 px-4">
      <div className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        
        {/* Dashboard Icon / Logo Placeholder */}
        <div className="px-3 border-r border-gray-200 hidden md:block">
           <LayoutDashboard className="text-blue-600" size={20} />
        </div>

        <ul className="flex items-center gap-1 relative">
          {navItems.filter(item => item.show).map((item) => (
            <li key={item.id} className="relative">
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors relative z-10 ${
                  item.active ? "text-blue-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>

                {/* Active Indicator (The Moving Background) */}
                {item.active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavDash;