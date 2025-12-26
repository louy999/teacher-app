import Image from "next/image";
import { RoleDetails, StudentDetails } from "@/types/studentDet";
import imageIconTeacher from "../../images/graduate-hat.png";
interface Props {
  roleDet: RoleDetails;
  studentDet: StudentDetails;
}

const PersonalDetails = ({ roleDet, studentDet }: Props) => {
  return (
    <section className=" rounded-2xl p-6 text-white flex items-center gap-6 z-10">
      <Image
        src={`${process.env.img}/image/${studentDet.profile_pic}`}
        alt="Student avatar"
        width={1000}
        height={1000}
        className="w-24 h-24 md:w-48 md:h-48 rounded-full object-cover "
      />

      <div>
        <h1 className="mb-2 text-black">{roleDet.full_name}</h1>
        <h1 className="mb-2 text-black">{roleDet.phone}</h1>
        <p className="opacity-90 text-xs flex justify-center items-center gap-2 text-black capitalize">
          <span className="flex justify-center items-center ">
            <Image
              width={1000}
              height={1000}
              src={imageIconTeacher}
              alt="Teacher Illustration"
              className="w-5 h-auto max-w-xs"
            />{" "}
            {roleDet.role}
          </span>{" "}
          · Stage {studentDet.stage}
        </p>
      </div>
    </section>
  );
};

export default PersonalDetails;
