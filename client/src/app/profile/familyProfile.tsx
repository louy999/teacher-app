/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";
import axios from "axios";
import StudentMapFetch from "./studentMapFetch";

const FamilyProfile = () => {
  const [dataParent, setDataParent] = useState([]);
  const value = getCookie("dataRoleToken");

  useEffect(() => {
    const getToken = async () => {
      if (value) {
        try {
          const decodedToken: any = await jwtVerify(
            value as string,
            new TextEncoder().encode(process.env.TOKEN_SECRET)
          );
          const getStudentFetch: any = await axios.get(
            `${process.env.local}/ps/parent/${decodedToken.payload.user.id}/teacher/${process.env.teacherId}`
          );
          setDataParent(getStudentFetch.data.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Token not found");
      }
    };

    getToken();
  }, [value]);

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight">
              Family Profiles
            </p>
            <p className="text-[#6a7681] text-sm font-normal leading-normal">
              Manage your children&apos;s profiles and track their progress.
            </p>
          </div>
        </div>
        <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Registered Children
        </h3>
        {dataParent.map((par: any, index: number) => (
          <StudentMapFetch key={index} dataStudent={par} />
        ))}
      </div>
    </div>
  );
};

export default FamilyProfile;
