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

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const submitApiLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.local}/users/auth`, {
        phone,
        password,
        teacher_id: process.env.teacherId,
      });

      setCookie("dataRoleToken", res.data.data.tokenUser, {
        maxAge: 60 * 60 * 24,
      });
      setCookie("UserDe", res.data.data.tokenData, {
        maxAge: 60 * 60 * 24,
      });

      if (res.data.data.role === "teachers") {
        router.replace("/dash");
      } else if (res.data.data.role === "students") {
        router.replace("/");
      } else if (res.data.data.role === "parents") {
        router.replace("/profile");
      } else if (res.data.data.role === "assistants") {
        router.replace("/dash");
      }
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      setErr(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setTimeout(() => {
        setErr("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 -z-20 bg-gradient-to-b from-blue-200 to-blue-100  flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl grid grid-cols-1 md:grid-cols-2 w-11/12 md:9/12 lg:w-6/12 overflow-hidden">
        {/* 3D Illustration */}
        <div className="hidden md:flex items-center justify-center ">
          <Image
            width={1000}
            height={1000}
            src={logo}
            alt="Teacher Illustration"
            className="w-full h-auto max-w-xs"
          />
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <h2 className="text-3xl  text-gray-800 text-center">
            <div className="font-bold capitalize">Welcome Back!</div>
            <div className="text-sm italic text-slate-500">
              Log in to your student account
            </div>
          </h2>

          <form onSubmit={submitApiLogin} className="space-y-6">
            <PhoneInput
              country={"eg"}
              value={phone}
              className="shadow-2xl"
              onChange={(value) => setPhone(value)}
              inputStyle={{
                width: "100%",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 shadow-2xl rounded-lg text-white font-semibold transition duration-300 cursor-pointer ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3B82F6] hover:bg-[#4338CA]"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {err && <div className="text-red-500 text-center ">{err}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
