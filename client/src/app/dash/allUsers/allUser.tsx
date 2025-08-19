/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AllStudent from "./allStudent";
import axios from "axios";
import AllAssistant from "./allAssistant";
import AddStudentModal from "../modal/students/addStudent";
import AllParent from "./allParent";
import AddParent from "../modal/parents/addParent";

const AllUser = ({ studentId }: any) => {
  const searchParams = useSearchParams();
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [modalAddParent, setModalAddParent] = useState(false);
  const search = searchParams.get("user");

  const [fetchParentId, setFetchParentId] = useState([]);
  const [fetchAssistId, setFetchAssistId] = useState([]);
  useEffect(() => {
    const getParent = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/ps/teacher/${process.env.teacherId}`
        );

        const uniqueParents = res.data.data.filter(
          (parent, index, self) =>
            index === self.findIndex((p) => p.parent_id === parent.parent_id)
        );

        setFetchParentId(uniqueParents);
      } catch (error) {
        console.log(error);
      }
    };
    getParent();
  }, []);
  useEffect(() => {
    const getAssistant = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/assistants/teacher/${process.env.teacherId}`
        );
        setFetchAssistId(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAssistant();
  }, []);

  return (
    <>
      {search === "student" ? (
        <>
          <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Students
          </h3>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      Name
                    </th>
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      phone
                    </th>
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-360 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      Grade
                    </th>
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 px-4 py-3 text-left text-[#111518] w-60  text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentId.map((student: any, index: any) => (
                    <AllStudent key={index} studentId={student.student_id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              onClick={() => {
                setOpenAddStudentModal(true);
              }}
              className="flex min-w-[84px] cursor-pointer max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Add Student</span>
            </button>
            {openAddStudentModal && (
              <AddStudentModal modal={setOpenAddStudentModal} />
            )}
          </div>
        </>
      ) : search === "parent" ? (
        <>
          <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Parent
          </h3>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      Name
                    </th>
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      phone
                    </th>

                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 px-4 py-3 text-left text-[#111518] w-60  text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchParentId.map((parentId, index) => (
                    <AllParent key={index} parentId={parentId.parent_id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              onClick={() => setModalAddParent(true)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Add Parent</span>
            </button>
          </div>
          {modalAddParent && (
            <AddParent setModalAddParent={setModalAddParent} />
          )}
        </>
      ) : search === "assistant" ? (
        <>
          <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Assistant
          </h3>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      Name
                    </th>
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      phone
                    </th>

                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 px-4 py-3 text-left text-[#111518] w-60  text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchAssistId.map((assist, index) => (
                    <AllAssistant key={index} assist={assist} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Add Parent</span>
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default AllUser;
