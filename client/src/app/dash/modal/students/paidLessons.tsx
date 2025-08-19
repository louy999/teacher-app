/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "../../../profile/[studentId]/lessonName";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const PaidLessonsDash = ({ roleDet, studentDet }: any) => {
  const [allSubFetch, setAllSubFetch] = useState([]);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [allChaptersFetch, setAllChaptersFetch] = useState([]);
  const [checkLesson, setCheckLesson] = useState("");
  const [allLessonFetch, setAllLessonFetch] = useState([]);
  const [selectLessonId, setSelectLessonId] = useState({});
  const [dataAddLesson, setDataAddLesson] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateEx, setDateEx] = useState("");
  const [err, setErr] = useState("");
  const fetchableLessonsPaid = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/subscribe/student/${roleDet.id}`
      );
      setAllSubFetch(res.data.data);
    } catch (error) {
      console.log(error);

      return <div>Error view</div>;
    }
  };
  useEffect(() => {
    fetchableLessonsPaid();
  }, [roleDet.id]);

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
  const addLesson = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.local}/subscribe`,
        dataAddLesson
      );
      console.log(res.data.data);
      setErr("add lesson successful ");
      setOpenAddLesson(false);
      setCheckLesson("");
      setSelectLessonId({});
      setDataAddLesson({});
      setDateEx("");
      fetchableLessonsPaid();
    } catch (error) {
      console.log(error);
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
            <div className=" border-2 rounded-md p-4">
              <div className="flex gap-5 justify-between">
                <select
                  name=""
                  id=""
                  value={checkLesson}
                  onChange={(e) => setCheckLesson(e.target.value)}
                  className="w-full bg-slate-200 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Select chapter
                  </option>
                  {allChaptersFetch.map((c, i) => (
                    <option key={i} value={c.id} displayed>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={dateEx}
                  onChange={(e) => setDateEx(e.target.value)}
                />{" "}
              </div>
              {selectLessonId && (
                <div className="flex gap-5 items-center justify-between text-black/50">
                  <div className="flex gap-5 items-center text-black/50">
                    <div>{selectLessonId.name}</div>
                    <div className="">{selectLessonId.price} L.E</div>
                  </div>
                  {!loading ? (
                    <input
                      type="button"
                      value="Add"
                      onClick={() => addLesson()}
                      className="bg-blue-400 px-10 py-2 m-2 rounded-md text-white text-sm font-semibold hover:bg-blue-500 transition-all duration-300 cursor-pointer ml-4"
                    />
                  ) : (
                    <input
                      type="button"
                      value="loading"
                      className="bg-blue-500 px-10 py-2 m-2 rounded-md text-white text-sm font-semibold hover:bg-blue-500 transition-all duration-300 cursor-pointer ml-4"
                    />
                  )}
                  {err}
                </div>
              )}
            </div>
            {checkLesson !== "" ? (
              <div className="w-screen  h-screen fixed bg-black/50 top-0 left-0">
                <div className="absolute w-44 left-2/4 top-2/4 -translate-2/5 bg-white p-4 rounded-md ">
                  <div
                    className="flex text-2xl justify-end mb-4 cursor-pointer hover:text-4xl duration-300"
                    onClick={() => {
                      setCheckLesson("");
                    }}
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
                        setDataAddLesson({
                          student_id: roleDet.id,
                          lesson_id: l.id,
                          expire: new Date(dateEx + "T00:00:00Z").toISOString(),
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
            ) : (
              ""
            )}
          </div>
        )}

        <div className="px-4 py-3 @container">
          <div className="flex overflow-hidden rounded-xl border border-[#dde1e3] bg-white">
            <table className="flex-1">
              <thead>
                <tr className="bg-white">
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Lesson Title
                  </th>
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Price
                  </th>
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Creation Date
                  </th>
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Expire Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {allSubFetch.map((sub: any, index: number) => {
                  const dateExpire = new Date(sub.expire);
                  const date = new Date(sub.date);

                  const formattedDateExpire = isNaN(dateExpire.getTime())
                    ? "Invalid Date"
                    : format(dateExpire, "MMM dd, yyyy ");
                  const formattedDateCreate = isNaN(date.getTime())
                    ? "Invalid Date"
                    : format(date, "MMM dd, yyyy ");

                  return (
                    <tr className="border-t border-t-[#dde1e3]" key={index}>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
                        <LessonName lessonId={sub.lesson_id} />
                      </td>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {Number(sub.price)}L.E
                      </td>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {formattedDateCreate}
                      </td>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
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
