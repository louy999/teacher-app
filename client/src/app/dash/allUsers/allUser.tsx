/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AllStudent from "./allStudent";
import axios from "axios";
import { useRouter } from "next/navigation";
import AllAssistant from "./allAssistant";
import AddStudentModal from "../modal/students/addStudent";
import AllParent from "./allParent";
import AddParent from "../modal/parents/addParent";
import AddAssistantsModal from "../modal/assistants/addAssistants";
import socket from "../../lib/socket";
const AllUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [modalAddParent, setModalAddParent] = useState(false);
  const [modalAddAssist, setModalAddAssist] = useState(false);
  const [student, setStudent] = useState([]);
  const search = searchParams.get("user");
  const [fetchParentId, setFetchParentId] = useState([]);
  const [fetchAssistId, setFetchAssistId] = useState([]);
  useEffect(() => {
    if (!search) {
      router.replace("?user=student");
    }
  }, [router, search]);
  //fetch student
  const getStudent = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/m/getAllUserTeacher/${process.env.teacherId}/students`
      );
      setStudent(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getStudent();
  }, [getStudent]);

  useEffect(() => {
    socket.on("all_student", getStudent);
    return () => socket.off("all_student", getStudent);
  }, [getStudent]);
  //fetch parent
  const getParent = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/m/getAllUserTeacher/${process.env.teacherId}/parents`
      );
      //filter unique parent_id
      const uniqueParents = res.data.data.filter(
        (parent, index, self) =>
          index === self.findIndex((p) => p.parent_id === parent.parent_id)
      );
      setFetchParentId(uniqueParents);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getParent();
  }, [getParent]);

  useEffect(() => {
    socket.on("all_parent", getParent);
    return () => socket.off("all_parent", getParent);
  }, [getParent]);
  //fetch assistant
  const getAssistant = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/m/getAllUserTeacher/${process.env.teacherId}/assistants`
      );

      setFetchAssistId(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getAssistant();
  }, [getAssistant]);

  useEffect(() => {
    socket.on("all_assist", getAssistant);
    return () => socket.off("all_assist", getAssistant);
  }, [getAssistant]);

  return (
    <>
      {search === "student" ? (
        <>
          <div className="flex px-4 py-3 justify-start gap-5 items-center">
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Students:
            </h3>
            <div className="flex items-center">
              {process.env.limitStudent}/{" "}
              <span
                className={`${
                  (student.length / process.env.limitStudent) * 100 >= 50
                    ? "bg-red-300"
                    : "bg-green-300"
                } p-1 rounded-md`}
              >
                {student.length}
              </span>
            </div>
            <button
              onClick={() => {
                setOpenAddStudentModal(true);
              }}
              className="flex min-w-[84px] cursor-pointer max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Add Student</span>
            </button>
          </div>

          <div className="px-4 py-3 @container">
            <div className="flex overflow-auto rounded-xl border border-[#dbe1e6] bg-white">
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
                  {student.map((student: any, index: any) => (
                    <AllStudent key={index} student={student} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <>
            {" "}
            {openAddStudentModal && (
              <AddStudentModal modal={setOpenAddStudentModal} />
            )}
          </>
        </>
      ) : search === "parent" ? (
        <>
          <div className="flex px-4 py-3 justify-start gap-5 items-center">
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Parent
            </h3>
            <button
              onClick={() => setModalAddParent(true)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Add Parent</span>
            </button>
          </div>

          <div className="px-4 py-3 @container">
            <div className="flex overflow-auto rounded-xl border border-[#dbe1e6] bg-white">
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

          <>
            {" "}
            {modalAddParent && (
              <AddParent setModalAddParent={setModalAddParent} />
            )}{" "}
          </>
        </>
      ) : search === "assistant" ? (
        <>
          <div
            className="flex px-4 py-3 justify-start gap-5 items-center"
            onClick={() => setModalAddAssist(true)}
          >
            <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Assistant
            </h3>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Add Assistant</span>
            </button>
          </div>

          <div className="px-4 py-3 @container">
            <div className="flex overflow-auto rounded-xl border border-[#dbe1e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 px-4 py-3 w-fit text-left text-[#111518]  text-sm font-medium leading-normal">
                      Name
                    </th>
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      phone
                    </th>
                    <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                      access
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

          {modalAddAssist && (
            <AddAssistantsModal setModalAddAssist={setModalAddAssist} />
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default AllUser;
