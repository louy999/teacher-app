/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { setCookie } from "cookies-next";
import logo from "../images/Teacher student-rafiki.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; 
import { Lock, LogIn, AlertCircle, Loader2 } from "lucide-react"; 

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const submitApiLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await axios.post(`${process.env.local}/users/auth`, {
        phone,
        password,
        teacher_id: process.env.teacherId,
      });

      setCookie("dataRoleToken", res.data.data.tokenUser, {
        maxAge: 60 * 60 * 24,
      });
      setCookie("UserDe", res.data.data.tokenData, { maxAge: 60 * 60 * 24 });
      router.refresh();
      const routes: any = {
        teachers: "/dash",
        students: "/",
        parents: "/profile",
        assistants: "/dash",
      };

      router.replace(routes[res.data.data.role] || "/");
    } catch (error: any) {
      setErr(
        error.response?.data?.message ||
          "Login failed. Please check your data.",
      );
    } finally {
      setLoading(false);
    }
  };

  // إعدادات الأنيميشن للحاويات
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-100">
      {/* الخلفية المزخرفة */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] rounded-3xl grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl overflow-hidden border border-slate-100 ${err ? "animate-shake" : ""}`}
      >
        {/* القسم الأيسر: Illustration */}
        <div className="hidden md:flex bg-blue-50/50 items-center justify-center p-12 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Image
              width={500}
              height={500}
              src={logo}
              alt="Illustration"
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>

        {/* القسم الأيمن: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            variants={itemVariants}
            className="mb-10 text-center md:text-left"
          >
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 mt-2">
              Enter your details to access your account
            </p>
          </motion.div>

          <form onSubmit={submitApiLogin} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Phone Number
              </label>
              <div className="relative group">
                <PhoneInput
                  country={"eg"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  containerClass="!border-none"
                  inputClass="!w-full !h-12 !text-lg !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-4 focus:!ring-blue-50/50 !transition-all"
                  buttonClass="!border-slate-200 !rounded-l-xl !bg-white"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-slate-900"
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm"
                >
                  <AlertCircle size={16} />
                  {err}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn size={20} />
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-slate-500 text-sm"
          >
            Don&apos;t have an account?{" "}
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              Contact Admin
            </span>
          </motion.p>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
