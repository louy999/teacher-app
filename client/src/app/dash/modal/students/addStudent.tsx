import React, { useState } from "react";
import axios from "axios";
import socket from "../../../lib/socket";

const AddStudentModal = ({ modal }) => {
  const [err, setErr] = useState("");
  const [full_name, setFull_name] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAddStudent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.local}/st/teacher/${process.env.teacherId}`
      );
      console.log(res.data.data);

      if (res.data.data.length > process.env.limit) {
        setErr("limit reached for students");
      } else {
        const addUser = await axios.post(`${process.env.local}/users`, {
          full_name,
          password,
          phone,
          role: "student",
        });
        const addStudent = await axios.post(
          `${process.env.local}/students/${process.env.teacherId}`,
          {
            id: addUser.data.data.id,
            stage: stage,
          }
        );
        console.log(addStudent.data.data);

        modal(false);
        socket.emit("add_user");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center h-screen w-screen bg-black/50 z-50">
      <div className="bg-white rounded-md text-black w-[400px]">
        <h2 className="text-xl font-semibold text-center py-4">Add Student</h2>
        <div>
          <div className="text-black text-xl p-4 relative">
            <label
              htmlFor="fullName"
              className="absolute top-1 text-base bg-white left-7 px-1 capitalize"
            >
              Full Name
            </label>
            <input
              type="text"
              onChange={(e) => setFull_name(e.target.value)}
              value={full_name}
              required
              id="fullName"
              className="border w-full p-2 rounded-md"
            />
          </div>
          <div className="text-black text-xl p-4 relative">
            <label
              htmlFor="password"
              className="absolute top-1 text-base bg-white left-7 px-1 capitalize"
            >
              Password
            </label>
            <input
              type="text"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              id="password"
              className="border w-full p-2 rounded-md"
            />
          </div>
          <div className="text-black text-xl p-4 relative">
            <label
              htmlFor="phone"
              className="absolute top-1 text-base bg-white left-7 px-1 capitalize"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
              className="border w-full p-2 rounded-md"
            />
          </div>
          <div className="text-black text-xl p-4 relative">
            <label
              htmlFor="stage"
              className="absolute top-1 text-base bg-white left-7 px-1 capitalize"
            >
              Stage
            </label>
            <input
              type="text"
              onChange={(e) => setStage(e.target.value)}
              value={stage}
              required
              id="stage"
              className="border w-full p-2 rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 p-4">
            <button
              onClick={() => modal(false)}
              className="bg-red-400 cursor-pointer hover:bg-red-500 duration-300 w-full text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            {!loading ? (
              <button
                onClick={handleAddStudent}
                className="bg-blue-400 hover:bg-blue-500 duration-300 cursor-pointer w-full text-white px-4 py-2 rounded-md"
              >
                Add Student
              </button>
            ) : (
              <button className="bg-blue-500 duration-300 cursor-pointer w-full text-white px-4 py-2 rounded-md">
                loading
              </button>
            )}
            {err}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
