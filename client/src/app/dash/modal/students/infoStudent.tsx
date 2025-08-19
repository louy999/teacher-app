import React from "react";
import Image from "next/image";

const InfoStudent = ({ studentDet, roleDet }) => {
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
          <div className="text-[#6a7681] text-base font-normal leading-normal">
            Phone: {roleDet.phone}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStudent;
