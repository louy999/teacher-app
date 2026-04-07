import React from "react";
import AllUser from "./allUsers/allUser";

const page = async () => {
  try {
    return (
      <>
        <div className="relative  size-full min-h-screen  bg-white  overflow-x-auto">
                  <AllUser />
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
