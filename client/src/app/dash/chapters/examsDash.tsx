/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineAssessment, MdDeleteForever } from "react-icons/md";
import EditExamDash from "../modal/chapter/examFolder/editExamDash";
import { IoMdAddCircle } from "react-icons/io";
import AddFormModal from "../modal/chapter/examFolder/addFormModal";

const ExamsDash = ({ lessonId }): any => {
  const [openExamId, setOpenExamId] = useState<string | null>(null);
  const [dataExam, setDataExam] = useState([]);
  const [modalAddExam, setModalAddExam] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchExams = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/exams/lesson/${lessonId}`
      );
      setDataExam(res.data.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };
  useEffect(() => {
    fetchExams();
  }, [lessonId]);
  const handelDeleteExam = async (examId) => {
    try {
      const res = await axios.delete(`${process.env.local}/exams/${examId}`);
      console.log(res.data.data);
      fetchExams();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="my-5">
      <div
        onClick={() => setModalAddExam(true)}
        className="flex w-fit items-center gap-4 "
      >
        <h2 className="text-xl font-bold text-gray-700 hover:text-3xl duration-300 hover:opacity-50 cursor-pointer">
          Assessment{" "}
        </h2>
        <IoMdAddCircle className="text-2xl" onClick={() => setOpen(true)} />
        <AddFormModal
          open={open}
          setOpen={setOpen}
          type="exam"
          lessonId={lessonId}
          onCreated={() => console.log("Exam Created!")}
        />
      </div>

      {dataExam.map((e: any, i: number) => (
        <div key={i} className="flex justify-between">
          <div
            onClick={() => setOpenExamId(e.id)}
            className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-slate-100 hover:p-3 hover:mb-3 duration-300 rounded-md transition-all"
          >
            <div className="flex items-center justify-center bg-[#F0F2F5] rounded-md p-3">
              <MdOutlineAssessment className="text-xl " />
            </div>
            <div>
              <div className="text-gray-800 font-semibold text-lg capitalize">
                {e.title}
              </div>
              <div className="text-sm text-gray-400">{e.time} Min</div>
            </div>
          </div>
          <MdDeleteForever
            onClick={() => {
              handelDeleteExam(e.id);
            }}
            className="text-3xl cursor-pointer text-red-400 hover:text-4xl hover:opacity-55 duration-300"
          />
        </div>
      ))}

      {openExamId && (
        <EditExamDash
          setOpenModelEditExam={() => setOpenExamId(null)}
          examId={openExamId}
        />
      )}

      {modalAddExam && <div></div>}
    </div>
  );
};

export default ExamsDash;
