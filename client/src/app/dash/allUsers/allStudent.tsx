/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import EditStudent from "../modal/students/editStudent";

const AllStudent = ({ student }: any) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <tr className={`border-t border-t-[#dbe1e6]   `}>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 w-80 h-[72px] px-4 py-2  text-[#111518] text-sm font-normal leading-normal">
          {student.extraDataUser.full_name}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {student.extraDataUser.phone}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {student.extraDataAccess.stage}
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
          dataUser={student.extraDataUser}
          setOpenModal={setOpenModal}
          dataStudent={student.extraDataAccess}
        />
      )}
    </>
  );
};

export default AllStudent;
