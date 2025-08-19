/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import axios from "axios";
import AllUser from "./allUsers/allUser";

const page = async () => {
  try {
    const cookieStore = await cookies();
    const tokenRole = cookieStore.get("dataRoleToken");
    const decodedToken: any = await jwtVerify(
      tokenRole.value,
      new TextEncoder().encode(process.env.TOKEN_SECRET)
    );
    const getAllStudentWithTeacher = await axios.get(
      `${process.env.local}/st/teacher/${decodedToken.payload.user.id}`
    );
    return (
      <>
        <div className="relative  size-full min-h-screen  bg-white  overflow-x-auto">
          <div className="layout-container  h-full  ">
            <div className="">
              <div className="layout-content-container w-full">
                <div className=" flex-wrap justify-between gap-3 p-4">
                  <div className=" min-w-72 flex-col gap-3">
                    <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight">
                      User Management
                    </p>
                    <p className="text-[#60768a] text-sm font-normal leading-normal">
                      Manage all users including assistants, students, and
                      parents.
                    </p>
                  </div>
                  <AllUser studentId={getAllStudentWithTeacher.data.data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.log(error);
  }
};

export default page;
