import React from "react";
import Image from "next/image";
import { Phone, GraduationCap, User, ShieldCheck } from "lucide-react";
import SubscribeTeacher from '../../../profile/[studentId]/subscribeTeacher';

const InfoStudent = ({ roleDet }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
        <Image
          src={roleDet?.studentExtra?.profile_pic}
          alt="student image"
          width={140}
          height={140}
          className="relative rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Full Name</p>
          <div className="flex items-center gap-2 text-gray-800 font-bold text-xl">
            <User size={18} className="text-blue-500" />
            {roleDet.student.full_name}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Contact</p>
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Phone size={18} className="text-emerald-500" />
            {roleDet.student.phone}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Education Stage</p>
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <GraduationCap size={18} className="text-amber-500" />
            {roleDet.studentExtra.stage}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Account Type</p>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck size={14} />
              {roleDet.student.role}
            </span>
          </div>
        </div>
        <SubscribeTeacher studentData={roleDet} />

      </div>
    </div>
  );
};

export default InfoStudent;