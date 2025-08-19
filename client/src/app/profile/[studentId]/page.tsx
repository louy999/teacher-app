import React from "react";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PersonalDetails from "./personalDetails";
import ViewedLessons from "./viewedLessons";
import PaidLessons from "./paidLessons";
import AllViewsExam from "./exam/allViewsExam";

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
        <div className="flex justify-center items-center flex-col">
          <PersonalDetails
            roleDet={getAllDetailsUserRole.data.data}
            studentDet={infoUser.data.data}
          />
          <ViewedLessons roleDet={getAllDetailsUserRole.data.data} />
          <PaidLessons roleDet={getAllDetailsUserRole.data.data} />
          <AllViewsExam roleDet={getAllDetailsUserRole.data.data} />
        </div>
      );
    } else {
      redirect("/");
    }
  } catch (error) {
    console.log(error);

    return <div>StudentProfilePage</div>;
  }
};

export default StudentProfilePage;
