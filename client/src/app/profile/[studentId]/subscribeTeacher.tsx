"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscribeTeacher = ({ studentId, dash }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const addSub = async () => {
    try {
      const res = await axios.post(`${process.env.local}/trans`, {
        teacher_id: process.env.teacherId,
        student_id: studentId.id,
        price: teacherData.data.teacherSub.price,
      });
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/m/subscribeTeacher/teacher/${process.env.teacherId}/student/${studentId.id}`
        );
        const data = res.data;
        setTeacherData(data);

        if (!data.data.teacherSub || !data.data.trans) return;

        const expireDate = new Date(data.data.teacherSub.expire_date);
        const now = new Date();

        const diff = expireDate.getTime() - now.getTime();

        setTimeLeft(diff > 0 ? diff : 0);

        if (diff > 0) {
          interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => clearInterval(interval);
  }, [studentId.id]);

  if (!teacherData) return <div className="text-center p-6">Loading...</div>;

  if (timeLeft <= 0) {
    return (
      <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold border border-orange-100">
        <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          !
        </span>
        <span className="text-black">Subscription Expired</span>
        {dash && teacherData.data.teacherSub && (
          <>
            <input
              type="button"
              value="Add Subscription"
              className="bg-red-400 p-3 rounded-md text-white text-sm font-semibold hover:bg-red-500 transition-all duration-300 cursor-pointer ml-4"
              onClick={() => setOpenModel(!openModel)}
            />
            {openModel && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-md shadow-md w-96">
                  <div>Add Subscription to this student</div>
                  <div className="flex gap-5 justify-between mt-4">
                    <input
                      type="button"
                      value="Add"
                      className="bg-blue-400 w-full p-3 rounded-md text-white text-sm font-semibold hover:bg-blue-500 transition-all duration-300 cursor-pointer"
                      onClick={addSub}
                    />
                    <input
                      type="button"
                      value="Close"
                      className="bg-red-400 w-full p-3 rounded-md text-white text-sm font-semibold hover:bg-red-500 transition-all duration-300 cursor-pointer"
                      onClick={() => setOpenModel(false)}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  } else {
    const formatTime = (ms) => {
      if (ms <= 0) return "0 day 0 hour 0 min 0 sec";
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${days} day ${hours} hour ${minutes} min ${seconds} sec`;
    };

    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="mt-4 bg-green-400 font-medium text-slate-700 p-2 rounded-md text-center">
          {formatTime(timeLeft)}
        </p>
      </div>
    );
  }
};
export default SubscribeTeacher;
