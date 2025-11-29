/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import socket from "../../../lib/socket";

const EditAssistantModal = ({
  setOpenModalEditAssistant,
  assist,
  dataUser,
}: any) => {
  const [accessList, setAccessList] = useState<string[]>(
    assist.extraDataAccess.access || []
  );

  const allAccess = ["assistants", "students", "parents", "chapters"];
  console.log(assist);

  const toggleAccess = (item: string) => {
    if (accessList.includes(item)) {
      setAccessList(accessList.filter((acc) => acc !== item));
    } else {
      setAccessList([...accessList, item]);
    }
  };

  const editAccess = async () => {
    try {
      await axios.patch(`${process.env.local}/assistants`, {
        profile_pic: assist.extraDataAccess.profile_pic,
        access: accessList,
        id: assist.extraDataAccess.id,
      });
      setOpenModalEditAssistant(false);
      socket.emit("add_assist");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center fixed bg-black/50 top-0 left-0 h-screen w-screen">
      <div className="bg-white rounded-md p-4  ">
        <div>
          <h1 className="text-center font-bold text-lg p-4">Edit Assistant</h1>
          <div className="w-8/12 my-10">
            <div className="header flex items-center gap-3">
              <Image
                src={`${process.env.img}/image/${assist.extraDataAccess.profile_pic}`}
                alt="student image"
                width={200}
                height={200}
                className="rounded-full bg-cover"
              />
              <div className="flex flex-col justify-center">
                <div className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {dataUser.full_name}
                </div>
                <div className="text-[#6a7681] text-base font-normal leading-normal">
                  {dataUser.role}
                </div>
                <div className="text-[#6a7681] text-base font-normal leading-normal pr-4 my-2">
                  <span className="block mb-2">Access:</span>
                  <div className="flex  gap-2 ">
                    {allAccess.map((item, index) => (
                      <span
                        key={index}
                        onClick={() => toggleAccess(item)}
                        className={`cursor-pointer px-3 py-1 rounded-md ${
                          accessList.includes(item)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[#6a7681] text-base font-normal leading-normal">
                  Phone: {dataUser.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-between">
          <button
            onClick={editAccess}
            className="cursor-pointer bg-blue-500 text-white rounded-md p-2 px-4"
          >
            Save
          </button>
          <button
            className="cursor-pointer bg-red-500 text-white rounded-md p-2 px-4 "
            onClick={() => setOpenModalEditAssistant(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssistantModal;
