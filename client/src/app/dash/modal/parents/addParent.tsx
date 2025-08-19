/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapInfoStudent from "./mapInfoStudent";

const AddParent = ({ setModalAddParent }: any) => {
  const [err, setErr] = useState("");
  const [full_name, setFull_name] = useState("");
  const [password, setPassword] = useState("");
  const [allDataStudentId, setAllDataStudentId] = useState([]);
  const [idSTudent, setIdSTudent] = useState("");

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAddStudent = async () => {
    setLoading(true);
    try {
      const addUser = await axios.post(`${process.env.local}/m/addUser`, {
        full_name,
        password,
        phone,
        role: "parents",
      });

      const res = await axios.get(
        `${process.env.local}/ps/parent/${addUser.data.data.user.id}/teacher/${process.env.teacherId}/student/${idSTudent}`
      );
      if (res.data.data.length) {
        setErr("already this student relation with parent ");
      } else {
        const fa = await axios.post(`${process.env.local}/ps`, {
          teacher_id: process.env.teacherId,
          parent_id: addUser.data.data.user.id,
          student_id: idSTudent,
        });
        console.log(fa.data.data);
        window.location.reload();
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setErr(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      } else {
        setErr("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const allStudentTeacher = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/st/teacher/${process.env.teacherId}`
        );
        setAllDataStudentId(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    allStudentTeacher();
  }, []);
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
          <div className="text-black text-xl p-4 relative w-full">
            <select
              name=""
              onChange={(e) => setIdSTudent(e.target.value)}
              id=""
              className="border rounded-md p-2 mb-5 w-full"
            >
              <option value="">select user add to parent</option>
              {allDataStudentId.map((id, i) => (
                <MapInfoStudent id={id} key={i} />
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 p-4">
            <button
              onClick={() => setModalAddParent(false)}
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

export default AddParent;
