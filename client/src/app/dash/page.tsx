import React from "react";
import AllUser from "./allUsers/allUser";

const page = async () => {
  try {
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
                  <AllUser />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    <div className="flex justify-center items-center text-red-300 w-full h-full bg-black/30">
      {error}
    </div>;
  }
};

export default page;
