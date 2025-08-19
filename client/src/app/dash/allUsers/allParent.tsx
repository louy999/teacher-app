/* eslint-disable @typescript-eslint/no-explicit-any */
"use clint";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import StudentsLink from "../modal/parents/studentsLink";
import AddStudentParentDash from "../modal/parents/addStudentParentDash";

const AllParent = ({ parentId }): any => {
  const [dataUser, setDataUser] = useState({});
  const [dataStudentID, setDataStudentID] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [OpenModalStudent, setOpenModalStudent] = useState(false);
  const fetchLinkedStudents = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/ps/parent/${parentId}/teacher/${process.env.teacherId}`
      );

      setDataStudentID(res.data.data);
    } catch (error) {
      console.error("Error fetching linked students:", error);
    }
  };
  const getParent = async () => {
    try {
      const res = await axios.get(`${process.env.local}/users/${parentId}`, {
        headers: {
          Authorization: `${getCookie("dataRoleToken")}`,
        },
      });
      setDataUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getParent();

    fetchLinkedStudents();
  }, [parentId]);

  return (
    <>
      <tr className={`border-t border-t-[#dbe1e6]   `}>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
          {dataUser.full_name}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {dataUser.phone}
        </td>

        <td
          onClick={() => setOpenModal(true)}
          className="cursor-pointer table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 h-[72px] px-4 py-2 w-60 text-[#60768a] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          Edit
        </td>
      </tr>
      {openModal && (
        <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/50">
          <div className="relative bg-white w-11/12 md:w-9/12 lg:w-2/4  h-3/4 rounded-lg overflow-hidden">
            <div className="flex justify-end">
              {" "}
              <IoClose
                className="text-4xl cursor-pointer hover:opacity-35 duration-300"
                onClick={() => setOpenModal(false)}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">Parent Details</h3>
              <p>Name: {dataUser.full_name}</p>
              <p>Phone: {dataUser.phone}</p>
            </div>
            <div className="p-4 relative">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">Student Link</h3>
                <div className="flex px-4 py-3 justify-start">
                  <button
                    onClick={() => setOpenModalStudent(true)}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Add Student</span>
                  </button>
                </div>
              </div>

              {dataStudentID.map((student: any, index: number) => (
                <StudentsLink studentId={student.student_id} key={index} />
              ))}
            </div>
          </div>
        </div>
      )}
      {OpenModalStudent && (
        <AddStudentParentDash
          setOpenModalStudent={setOpenModalStudent}
          dataUser={dataUser}
        />
      )}
    </>
  );
};

export default AllParent;
