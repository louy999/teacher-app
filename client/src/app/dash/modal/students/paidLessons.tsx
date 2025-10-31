/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "../../../profile/[studentId]/lessonName";
import { IoMdClose } from "react-icons/io";

const PaidLessonsDash = ({ roleDet, studentDet }: any) => {
  const [allSubFetch, setAllSubFetch] = useState([]);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [allChaptersFetch, setAllChaptersFetch] = useState([]);
  const [checkLesson, setCheckLesson] = useState("");
  const [allLessonFetch, setAllLessonFetch] = useState([]);
  const [selectLessonId, setSelectLessonId] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateEx, setDateEx] = useState("");
  const [err, setErr] = useState("");
  // get All lessons paid for student
  // get All lessons paid for student
  const fetchableLessonsPaid = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/subscribe/student/${roleDet.id}`
      );
      setAllSubFetch(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [roleDet.id]);
  //call function to get all lessons paid for student
  useEffect(() => {
    fetchableLessonsPaid();
  }, [fetchableLessonsPaid, roleDet.id]);

  // get all chapters for student stage
  useEffect(() => {
    const allChapter = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/chapters/stage/${studentDet.stage}`
        );
        setAllChaptersFetch(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    allChapter();
  }, [studentDet.stage]);
  // get all lessons for selected chapter
  useEffect(() => {
    const allLessons = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/lessons/chapter/${checkLesson}`
        );
        setAllLessonFetch(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (checkLesson !== "") {
      allLessons();
    }
  }, [checkLesson]);
  // add lesson to student
  const addLesson = async () => {
    if (!selectLessonId.id || !dateEx) {
      setErr("Please select lesson and expiration date");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        student_id: roleDet.id,
        lesson_id: selectLessonId.id,
        teacher_id: process.env.teacherId,
        expire: new Date(dateEx + "T00:00:00Z").toISOString(),
        price: selectLessonId.price,
      };

      await axios.post(`${process.env.local}/subscribe`, payload);
      setErr("Lesson added successfully ✅");
      setOpenAddLesson(false);
      setCheckLesson("");
      setSelectLessonId({});
      setDateEx("");
      fetchableLessonsPaid();
    } catch (error) {
      console.log(error);
      setErr("Failed to add lesson ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full p-2 h-60 overflow-y-auto">
        <h2 className="text-[#121416] flex justify-between text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          <div> Paid Lessons</div>
          <input
            type="button"
            value="Add lesson"
            className="bg-blue-400 p-3 rounded-md text-white text-sm font-semibold hover:bg-blue-500 transition-all duration-300 cursor-pointer ml-4"
            onClick={() => setOpenAddLesson(!openAddLesson)}
          />
        </h2>

        {openAddLesson && (
          <div>
            <div className="border-2 rounded-md p-4">
              <div className="flex gap-5 justify-between">
                <select
                  value={checkLesson}
                  onChange={(e) => setCheckLesson(e.target.value)}
                  className="w-full bg-slate-200 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Select chapter
                  </option>
                  {allChaptersFetch.map((c, i) => (
                    <option key={i} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {checkLesson !== "" && (
                <div className="w-screen h-screen fixed bg-black/50 top-0 left-0">
                  <div className="absolute w-44 left-2/4 top-2/4 -translate-2/5 bg-white p-4 rounded-md">
                    <div
                      className="flex text-2xl justify-end mb-4 cursor-pointer hover:text-4xl duration-300"
                      onClick={() => setCheckLesson("")}
                    >
                      <IoMdClose />
                    </div>
                    {allLessonFetch.map((l, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectLessonId({
                            id: l.id,
                            name: l.title,
                            price: l.price,
                          });
                          setCheckLesson("");
                        }}
                        className="text-lg bg-slate-200 mb-3 p-2 rounded-md hover:bg-slate-400 duration-300 cursor-pointer"
                      >
                        {l.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectLessonId.id && (
                <div className="mt-4 flex gap-5 justify-between items-center">
                  <input
                    type="date"
                    value={dateEx}
                    onChange={(e) => setDateEx(e.target.value)}
                    className="bg-slate-200 p-2 rounded-md"
                  />
                  {!loading ? (
                    <input
                      type="button"
                      value="Add"
                      disabled={!dateEx}
                      onClick={addLesson}
                      className={`px-10 py-2 m-2 rounded-md text-white text-sm font-semibold transition-all duration-300 cursor-pointer ${
                        dateEx
                          ? "bg-blue-400 hover:bg-blue-500"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    />
                  ) : (
                    <input
                      type="button"
                      value="loading"
                      className="bg-blue-500 px-10 py-2 m-2 rounded-md text-white text-sm font-semibold"
                    />
                  )}
                  <div className="text-red-500">{err}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-4 py-3 @container">
          <div className="flex overflow-hidden rounded-xl border border-[#dde1e3] bg-white">
            <table className="flex-1">
              <thead>
                <tr className="bg-white">
                  <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Lesson Title
                  </th>
                  <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Creation Date
                  </th>
                  <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Expire Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {allSubFetch.map((sub: any, index: number) => {
                  const dateExpire = new Date(sub.expire);
                  const dateCreate = new Date(sub.date);

                  const formattedDateExpire = isNaN(dateExpire.getTime())
                    ? "Invalid Date"
                    : format(dateExpire, "MMM dd, yyyy");
                  const formattedDateCreate = isNaN(dateCreate.getTime())
                    ? "Invalid Date"
                    : format(dateCreate, "MMM dd, yyyy");

                  return (
                    <tr className="border-t border-t-[#dde1e3]" key={index}>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
                        <LessonName lessonId={sub.lesson_id} />
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {Number(sub.price)} L.E
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {formattedDateCreate}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {formattedDateExpire}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaidLessonsDash;
