/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import socket from "../../../lib/socket";

const AddAssistantsModal = ({ setModalAddAssist }: any) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accessList, setAccessList] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const allAccess = ["students", "parents", "assistants", "chapters"];

  const toggleAccess = (item: string) => {
    if (accessList.includes(item)) {
      setAccessList(accessList.filter((a) => a !== item));
    } else {
      setAccessList([...accessList, item]);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/teacherAssist/teacher/${process.env.teacherId}`
      );
      if (res.data.data.length >= Number(process.env.assist)) {
        setErr("limit reached for assistants");
        return;
      } else {
        await axios.post(`${process.env.local}/m/addUser`, {
          full_name: name,
          phone,
          password,
          role: "assistants",
          teacher_id: process.env.teacherId,
          access: accessList,
        });

        setName("");
        setPhone("");
        setPassword("");
        setAccessList([]);
        socket.emit("add_assist");
        setModalAddAssist(false);
      }
    } catch (error) {
      console.error("Error creating assistant:", error);
    }
  };

  return (
    <div className="fixed bg-black/50 left-0 top-0 h-screen w-screen flex items-center justify-center ">
      <div className="bg-white rounded-md p-4 w-[400px]">
        <div>
          <h2 className="text-lg font-bold mb-4">Add Assistant</h2>
          <div>
            {/* Name */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter name"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter phone number"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter password"
              />
            </div>

            {/* Access buttons */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Access</label>
              <div className="flex flex-wrap gap-2">
                {allAccess.map((item, idx) => (
                  <span
                    key={idx}
                    onClick={() => toggleAccess(item)}
                    className={`cursor-pointer px-3 py-1 rounded-md ${
                      accessList.includes(item)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-red-400 capitalize">{err}</div>
        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSave}
            className="p-2 rounded-md cursor-pointer bg-blue-500 text-white"
          >
            Save
          </button>
          <button
            className="p-2 rounded-md cursor-pointer bg-red-500 text-white"
            onClick={() => setModalAddAssist(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssistantsModal;
