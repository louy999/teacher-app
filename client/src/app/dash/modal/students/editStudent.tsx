/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IoClose } from "react-icons/io5";
import InfoStudent from "./infoStudent";
import PaidLessonsDash from "./paidLessons";
import ViewedLessonsDash from "./viewdLesson";
import AllViewsExam from "../../../profile/[studentId]/exam/allViewsExam";

const EditStudent = ({ dataUser, dataStudent, setOpenModal }: any) => {
  return (
    <div className="fixed flex justify-center items-center top-0 left-0 bg-black/50 w-screen h-screen">
      <div className="w-full md:w-8/12 bg-white rounded-md p-4">
        <div className="flex justify-end">
          <div>
            <IoClose
              className="text-4xl cursor-pointer hover:opacity-35 duration-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
        </div>
        <InfoStudent roleDet={dataUser} studentDet={dataStudent} />
        <PaidLessonsDash roleDet={dataUser} studentDet={dataStudent} />
        <ViewedLessonsDash roleDet={dataUser} />
        <AllViewsExam roleDet={dataUser} />
      </div>
    </div>
  );
};

export default EditStudent;
