/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import axios from "axios";
import EditStudent from "../modal/students/editStudent";
import socket from "../../lib/socket";

const AllStudent = ({ studentId }: any) => {
  const [dataUser, setDataUser] = useState({});
  const [dataStudent, setDataStudent] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const getStudent = async () => {
    try {
      const res: any = await axios.get(
        `${process.env.local}/users/${studentId}`,
        {
          headers: {
            Authorization: `${getCookie("dataRoleToken")}`,
          },
        }
      );
      setDataUser(res.data.data);
      const student: any = await axios.get(
        `${process.env.local}/students/${studentId}`
      );
      setDataStudent(student.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStudent();
  }, [studentId]);
  useEffect(() => {
    socket.on("all_user", getStudent);

    return () => {
      socket.off("all_user", getStudent);
    };
  }, []);
  return (
    <>
      <tr className={`border-t border-t-[#dbe1e6]   `}>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
          {dataUser.full_name}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {dataUser.phone}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {dataStudent.stage}
        </td>
        <td
          onClick={() => {
            setOpenModal(true);
          }}
          className="cursor-pointer table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 h-[72px] px-4 py-2 w-60 text-[#60768a] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          Edit
        </td>
      </tr>
      {openModal && (
        <EditStudent
          dataUser={dataUser}
          setOpenModal={setOpenModal}
          dataStudent={dataStudent}
        />
      )}
    </>
  );
};

export default AllStudent;
