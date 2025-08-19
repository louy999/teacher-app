"use client";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../images/Teacher student-bro.png"; // change to your 3D image

const RegisterPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitApiLogin = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addUser: any = await axios.post(`${process.env.local}/users`, {
        full_name: name,
        password,
        phone,
        role: "student",
      });
      await axios.post(
        `${process.env.local}/students/${process.env.teacherId}`,
        {
          id: addUser.data.data.id,
          subscribe: false,
          paid: "",
          stage,
        }
      );

      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const stages = ["1 year", "2 year", "3 year"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl overflow-hidden">
        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center bg-teal-100 p-6">
          <Image
            src={logo}
            alt="Register Illustration"
            className="w-full h-auto max-w-xs"
            width={1000}
            height={1000}
          />
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Student Registration
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <select
            name="stage"
            onChange={(e) => setStage(e.target.value)}
            value={stage}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="" disabled>
              Educational Stage
            </option>
            {stages.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <button
            onClick={submitApiLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Back to login */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-teal-600 font-semibold hover:underline"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
