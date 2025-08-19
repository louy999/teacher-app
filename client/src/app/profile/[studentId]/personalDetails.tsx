/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";

const PersonalDetails = ({ roleDet, studentDet }: any) => {
  return (
    <div className="w-8/12 my-10">
      <div className="header flex items-center gap-3">
        <Image
          src={`${process.env.img}/image/${studentDet.profile_pic}`}
          alt="student image"
          width={200}
          height={200}
          className="rounded-full bg-cover"
        />
        <div className="flex flex-col justify-center">
          <div className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em]">
            {roleDet.full_name}
          </div>
          <div className="text-[#6a7681] text-base font-normal leading-normal">
            {roleDet.role}
          </div>
          <div className="text-[#6a7681] text-base font-normal leading-normal">
            Stage: {studentDet.stage}
          </div>
        </div>
      </div>
      <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Personal Details
      </h2>
      <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
        <p className="text-[#6a7681] text-sm font-normal leading-normal">
          Full Name
        </p>
        <p className="text-[#121416] text-sm font-normal leading-normal">
          {roleDet.full_name}
        </p>
      </div>
      <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
        <p className="text-[#6a7681] text-sm font-normal leading-normal">
          Phone Number
        </p>
        <p className="text-[#121416] text-sm font-normal leading-normal">
          {roleDet.phone}
        </p>
      </div>
    </div>
  );
};

export default PersonalDetails;
