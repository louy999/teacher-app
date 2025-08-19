import React, { useEffect, useState } from "react";
import axios from "axios";
import MapInfoStudent from "./mapInfoStudent";

const AddStudentParentDash = ({ setOpenModalStudent, dataUser }) => {
  const [saving, setSaving] = useState(false);
  const [allDataStudentId, setAllDataStudentId] = useState([]);
  const [idSTudent, setIdSTudent] = useState("");
  const [err, setErr] = useState("");
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
  const addStudent = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/ps/parent/${dataUser.id}/teacher/${process.env.teacherId}/student/${idSTudent}`
      );
      if (res.data.data.length) {
        setErr("already this student relation with parent ");
      } else {
        await axios.post(`${process.env.local}/ps`, {
          teacher_id: process.env.teacherId,
          parent_id: dataUser.id,
          student_id: idSTudent,
        });
        setOpenModalStudent(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/50">
        <div className="relative bg-white  rounded-lg overflow-hidden p-4">
          <h2 className="font-bold mb-5">
            Add Student to {dataUser.full_name}
          </h2>
          <select
            name=""
            onChange={(e) => setIdSTudent(e.target.value)}
            id=""
            className="border rounded-md p-2 mb-5"
          >
            <option value="">select user add to parent</option>
            {allDataStudentId.map((id, i) => (
              <MapInfoStudent id={id} key={i} />
            ))}
          </select>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={addStudent}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              onClick={() => setOpenModalStudent(false)}
            >
              Close
            </button>
          </div>
          {err}
        </div>
      </div>
    </>
  );
};

export default AddStudentParentDash;
