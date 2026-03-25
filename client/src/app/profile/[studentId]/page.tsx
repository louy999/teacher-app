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

const StudentProfilePage = async ({ params }: { params: { studentId: string } }) => {
  const { studentId } = await params;
  const cookieStore = await cookies();
  const roleToken = cookieStore.get("dataRoleToken");

  if (!roleToken) redirect("/login");

  try {
    const userResponse = await axios.get(
      `${process.env.local}/users/${studentId}`,
      { headers: { Authorization: roleToken.value } }
    );

    const userData = userResponse.data.data;
    if (userData.role !== "students") {
      redirect("/");
    }

    const infoResponse = await axios.get(`${process.env.local}/students/${studentId}`);
    const studentInfo = infoResponse.data.data;
console.log(studentInfo)

    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#4F46E5] pt-16 pb-32 px-4 md:px-10">
          <WavesProfile />
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <PersonalDetails roleDet={userData} studentDet={studentInfo} />
            <SubscribeTeacher studentId={userData} dash={false} />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <ViewedLessons roleDet={userData} />
             </div>
             <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <PaidLessons roleDet={userData} />
             </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-2">
             <AllViewsExam roleDet={userData} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    redirect("/");
  }
};

export default StudentProfilePage;