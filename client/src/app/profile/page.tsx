/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";
import { useRouter } from "next/navigation";
import FamilyProfile from "./familyProfile";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const router = useRouter();
  const role = getCookie("dataRoleToken");
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    const getTokenVerify = async () => {
      if (!role) return;
      try {
        const decodedToken: any = await jwtVerify(
          role,
          new TextEncoder().encode(process.env.TOKEN_SECRET)
        );
        setTokenData(decodedToken.payload.user);
      } catch (error) { console.error(error); }
    };
    getTokenVerify();
  }, [role]);

  useEffect(() => {
    if (tokenData) {
      if (tokenData.role === "students") router.push(`/profile/${tokenData.id}`);
      else if (tokenData.role !== "parents") router.push(`/`);
    }
  }, [tokenData, router]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AnimatePresence mode="wait">
        {!tokenData ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex h-screen items-center justify-center"
          >
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </motion.div>
        ) : tokenData.role === "parents" && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FamilyProfile />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;