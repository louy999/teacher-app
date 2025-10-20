"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscribeTeacher = ({ studentId }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [subData, setSubData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get teacher data
        const res = await axios.get(
          `${process.env.local}/teachers/${process.env.teacherId}`
        );
        const teacher = res.data.data;
        setTeacherData(teacher);

        // 2️⃣ Check if teacher is paid
        if (teacher.paid) {
          // 3️⃣ Get student's subscription
          const ifSub = await axios.get(
            `${process.env.local}/trans/teacher/${process.env.teacherId}/student/${studentId.id}`
          );

          if (ifSub.data.data) {
            const sub = ifSub.data.data;
            console.log(sub);

            setSubData(sub);

            const startDate = new Date(sub.date);
            const expireDate = new Date(teacher.expire_date);
            const now = new Date();

            const diff = expireDate.getTime() - now.getTime();
            const total = expireDate.getTime() - startDate.getTime();

            setTimeLeft(diff > 0 ? diff : 0);
            setTotalTime(total > 0 ? total : 0);

            if (diff > 0) {
              const interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
              }, 1000);
              return () => clearInterval(interval);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [studentId.id]);

  // 🧮 Format time left
  const formatTime = (ms) => {
    if (ms <= 0) return "0 day 0 hour 0 min 0 sec";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days} day ${hours} hour ${minutes} min ${seconds} sec`;
  };

  // ⏱️ Circular progress setup
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (timeLeft / totalTime) * circumference : 0;

  // 💡 Loading state
  if (!teacherData) return <div className="text-center p-6">loading...</div>;

  // ❌ No subscription
  if (!teacherData.paid || !subData || timeLeft === 0)
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#ddd"
            strokeWidth="10"
            fill="none"
          />
        </svg>
        <p className="text-red-500 mt-4 text-lg font-semibold">Not Subscribe</p>
      </div>
    );

  // ✅ Active subscription (countdown)
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="#22c55e"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
          style={{
            transition: "stroke-dashoffset 1s linear",
          }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="22"
          fontWeight="bold"
          fill="#16a34a"
        >
          {Math.floor((timeLeft / totalTime) * 100)}%
        </text>
      </svg>

      <p className="mt-4 text-gray-700 font-medium text-center">
        {formatTime(timeLeft)}
      </p>
    </div>
  );
};

export default SubscribeTeacher;
