"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getCookie } from "cookies-next/client";
import Image from "next/image";

// تعريف الواجهة الخاصة بـ user
interface User {
  profile_pic: string;
  stage: string;
}

interface DataStudent {
  student_id: string;
  full_name: string;
}

const StudentMapFetch = ({ dataStudent }: { dataStudent: DataStudent }) => {
  const [data, setData] = useState<DataStudent>({
    student_id: "",
    full_name: "",
  });
  const [user, setUser] = useState<User>({ profile_pic: "", stage: "" });

  useEffect(() => {
    const getStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/users/${dataStudent.student_id}`,
          {
            headers: {
              Authorization: `${getCookie("dataRoleToken")}`,
            },
          }
        );
        const userRes = await axios.get(
          `${process.env.local}/students/${dataStudent.student_id}`
        );
        setUser(userRes.data.data);
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getStudent();
  }, [dataStudent]);

  return (
    <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit">
          <Image
            src={`${process.env.img}/image/${user.profile_pic}`}
            alt="profile_pic"
            width={200}
            height={200}
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[#121416] text-base font-medium leading-normal line-clamp-1">
            {data.full_name}
          </p>
          <p className="text-[#6a7681] text-sm font-normal leading-normal line-clamp-2">
            Grade {user.stage}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-medium leading-normal w-fit">
          <Link
            href={`/profile/${dataStudent.student_id}`}
            className="truncate"
          >
            View Profile
          </Link>
        </button>
      </div>
    </div>
  );
};

export default StudentMapFetch;
