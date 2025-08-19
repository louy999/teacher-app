"use client";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { setCookie } from "cookies-next";
import logo from "../images/Teachers' Day-cuate.png";
import Image from "next/image";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submitApiLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.local}/users/auth`, {
        phone,
        password,
      });

      setCookie("dataRoleToken", res.data.data.tokenUser, {
        maxAge: 60 * 60 * 24,
      });
      setCookie("UserDe", res.data.data.tokenData, {
        maxAge: 60 * 60 * 24,
      });
      window.location.reload();
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl overflow-hidden">
        {/* 3D Illustration */}
        <div className="hidden md:flex items-center justify-center bg-purple-100 p-6">
          <Image
            width={1000}
            height={1000}
            src={logo}
            // src="https://storyset.com/illustration/teachers-day/cuate"
            alt="Teacher Illustration"
            className="w-full h-auto max-w-xs"
          />
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <h2 className="text-2xl  text-gray-800 text-center">
            Login With{" "}
            <span className="font-bold capitalize">
              {process.env.teacherName}
            </span>
          </h2>

          <PhoneInput
            country={"eg"}
            value={phone}
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            onClick={submitApiLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {err && <div className="text-red-500 text-center ">{err}</div>}
          {/* Register Link */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
