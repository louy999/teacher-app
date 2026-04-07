import React from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import PersonalDetails from "./personalDetails";
import ViewedLessons from "./viewedLessons";
import PaidLessons from "./paidLessons";
import AllViewsExam from "./allViewsExam";
import SubscribeTeacher from "./subscribeTeacher";
import WavesProfile from '../../components/waves/wavesProfile';
import { headers } from 'next/headers'

const StudentProfilePage = async ({ params }: { params: { studentId: string } }) => {
  const { studentId } = await params;
    const headersList = await headers()
  const userAgent = headersList.get('decoded-token')
        const parsedData = JSON.parse(userAgent);
console.log(parsedData)
if(parsedData.user.role==="students"){

  if(parsedData.user.id!==studentId) {redirect("/")}
}


  try {
    const userResponse = await axios.get(
      `${process.env.local}/m/profile/student/${studentId}/teacher/${process.env.teacherId}`,
    );

    const userData = userResponse.data.data;

    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#4F46E5] pt-16 pb-32 px-4 md:px-10">
          <WavesProfile />
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <PersonalDetails roleDet={userData.student} studentDet={userData.studentExtra} />
            <SubscribeTeacher studentData={userData} dash={false} />
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