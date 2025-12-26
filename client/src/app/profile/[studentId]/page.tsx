import React from "react";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PersonalDetails from "./personalDetails";
import ViewedLessons from "./viewedLessons";
import PaidLessons from "./paidLessons";
import AllViewsExam from "./exam/allViewsExam";
import SubscribeTeacher from "./subscribeTeacher";
import WavesProfile from '../../components/waves/wavesProfile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StudentProfilePage = async ({ params }: any) => {
  const paramsStudentId = await params;
  const cookieStore = await cookies();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role: any = cookieStore.get("dataRoleToken") || null;

  try {
    const getAllDetailsUserRole = await axios.get(
      `${process.env.local}/users/${paramsStudentId.studentId}`,
      {
        headers: {
          Authorization: `${role.value}`,
        },
      }
    );
    if (getAllDetailsUserRole.data.data.role === "students") {
      const infoUser = await axios.get(
        `${process.env.local}/students/${paramsStudentId.studentId}`
      );

      return (
        <div className="flex justify-center items-center flex-col bg-slate-100 p-2">
         
          <div className="w-11/12 lg:w-8/12 px-4 flex  justify-between items-center flex-wrap lg:flex-nowrap gap-4  relative overflow-hidden rounded-t-2xl p-6 bg-gradient-to-br from-[#EEF0FF] via-[#dddff7] to-white ">
            <WavesProfile />
            <PersonalDetails
              roleDet={getAllDetailsUserRole.data.data}
              studentDet={infoUser.data.data}
            />
            <SubscribeTeacher
              studentId={getAllDetailsUserRole.data.data}
              dash={false}
            />
          </div>
            
          <div className=" w-11/12 lg:w-8/12 flex flex-wrap lg:flex-nowrap justify-center items-start  gap-2 bg-white rounded-t-2xl relative -top-5 ">
          <ViewedLessons roleDet={getAllDetailsUserRole.data.data} />
          <PaidLessons roleDet={getAllDetailsUserRole.data.data} />
          </div>
          <AllViewsExam roleDet={getAllDetailsUserRole.data.data} />
        </div>
      );
    } else {
      redirect("/");
    }
  } catch (error) {
    console.log(error);

    redirect("/");
    return <div>{error.message}</div>;
  }
};

export default StudentProfilePage;
