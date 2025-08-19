import React from "react";
import { useEffect } from "react";
import axios from "axios";

const AddStudentToParent = ({ setOpenModalStudent }) => {
  useEffect(() => {
    const getAllSTudents = async () => {
      try {
        const res = await axios.get(`${process.env.local}/students`);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    getAllSTudents();
  }, []);
  return (
    <div className=" absolute top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-md">
        <div className="flex justify-end p-4">
          <button
            className="text-2xl text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setOpenModalStudent(false)}
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold">Add Student to Parent</h2>
        </div>
      </div>
    </div>
  );
};

export default AddStudentToParent;
