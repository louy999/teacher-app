/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import socket from "../../lib/socket";

const TeacherSubscribe = ({ dataSubTeacher }) => {
  console.log(dataSubTeacher);

  const [expireDateModal, setExpireDateModal] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [active, setActive] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [newExpire, setNewExpire] = useState("");
  const [newActive, setNewActive] = useState("");

  const updatedTeacherSub = async (price, active, expire_date) => {
    try {
      const res = await axios.patch(`${process.env.local}/teacherSub/`, {
        id: dataSubTeacher.teacherSub.id,
        price,
        active,
        expire_date,
      });
      setExpireDateModal(false);
      setPriceModal(false);
      setActive(false);
      socket.emit("update_teacher");
      console.log(res.data.data);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <>
      {dataSubTeacher.teacherSub && (
        <div className="w-full flex items-center justify-start mb-4 px-4 py-2 border-b border-b-[#dbe1e6]">
          {/* expire date */}
          <div className="flex items-center gap-5  cursor-pointer">
            <div
              className="flex justify-start gap-2 items-center"
              onClick={() => setExpireDateModal(true)}
            >
              <label className="text-sm font-medium text-gray-700">
                Expire Date:
              </label>
              <div className="border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:outline-none bg-gray-50">
                {dataSubTeacher.teacherSub.expire_date ? (
                  (() => {
                    const parsedDate = parseISO(
                      dataSubTeacher.teacherSub.expire_date
                    );
                    return isNaN(parsedDate.getTime())
                      ? "Invalid Date"
                      : format(parsedDate, "MMM dd, yyyy");
                  })()
                ) : (
                  <span className="text-gray-400">No date</span>
                )}{" "}
              </div>
            </div>

            {/* Active Switch */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-sm font-medium text-gray-700">Active:</div>
              <div
                className={`flex items-center h-7 w-14 px-1 rounded-full cursor-pointer duration-300 ${
                  dataSubTeacher.teacherSub.active
                    ? "justify-start bg-slate-300"
                    : "justify-end bg-slate-300"
                }`}
                onClick={() => {
                  setNewActive(dataSubTeacher.teacherSub.active); // set initial value
                  setActive(true); // open modal
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    dataSubTeacher.teacherSub.active
                      ? "bg-blue-500"
                      : "bg-black"
                  }`}
                ></div>
              </div>
            </div>

            {/* Price */}
            <div
              className="text-sm text-gray-700 cursor-pointer"
              onClick={() => setPriceModal(true)}
            >
              <span className="font-medium">Price:</span>{" "}
              <span className="font-semibold">
                {dataSubTeacher.teacherSub.price} L.E
              </span>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Lessons Subscriptions
      </h3>
      <div className="px-4 py-3 @container">
        <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
          <table className="flex-1">
            <thead>
              <tr className="bg-white">
                <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                  Student Name
                </th>

                <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-360 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                  price
                </th>
                <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 px-4 py-3 text-left text-[#111518] w-60  text-sm font-medium leading-normal">
                  expire Date
                </th>
              </tr>
            </thead>
            <tbody>
              {dataSubTeacher.trans &&
                dataSubTeacher.trans.map((teacherSub: any, index: any) => {
                  const expireDate = parseISO(teacherSub.date);
                  const formattedExpire = isNaN(expireDate.getTime())
                    ? "Invalid Date"
                    : format(expireDate, "MMM dd, yyyy");

                  return (
                    <tr className="border-t border-t-[#dbe1e6]" key={index}>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
                        {teacherSub.student.full_name}
                      </td>

                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
                        {teacherSub.price} L.E
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
                        {formattedExpire}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {expireDateModal && (
        <div className="fixed  flex justify-center items-center w-full h-full bg-black/50 top-0 left-0">
          <div className="bg-white w-96 rounded-md shadow-2xl p-4 py-2">
            <label htmlFor="date">Expire Date: </label>

            <input
              type="date"
              id="date"
              className="w-full mb-10 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setNewExpire(e.target.value)}
              value={
                newExpire === ""
                  ? dataSubTeacher.teacherSub.expire_date.slice(0, 10)
                  : newExpire
              }
            />
            <div className="flex w-full justify-between gap-5">
              <input
                type="button"
                value="Save"
                onClick={() =>
                  updatedTeacherSub(
                    dataSubTeacher.teacherSub.price,
                    dataSubTeacher.teacherSub.active,
                    newExpire
                  )
                }
                className="bg-blue-500 text-white rounded-md p-2 px-4"
              />
              <input
                type="button"
                value="Close"
                onClick={() => setExpireDateModal(false)}
                className="bg-red-500 text-white rounded-md p-2 px-4"
              />
            </div>
          </div>
        </div>
      )}
      {priceModal && (
        <div className="fixed  flex justify-center items-center w-full h-full bg-black/50 top-0 left-0">
          <div className="bg-white w-96 rounded-md shadow-2xl p-4 py-2">
            <label htmlFor="number">Price: </label>
            <input
              type="number"
              id="number"
              className="w-full mb-10 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setNewPrice(e.target.value)}
              value={
                newPrice === "" ? dataSubTeacher.teacherSub.price : newPrice
              }
            />
            <div className="flex w-full justify-between gap-5">
              <input
                type="button"
                value="Save"
                onClick={() =>
                  updatedTeacherSub(
                    newPrice,
                    dataSubTeacher.teacherSub.active,
                    dataSubTeacher.teacherSub.expire_date
                  )
                }
                className="bg-blue-500 text-white rounded-md p-2 px-4"
              />
              <input
                type="button"
                value="Close"
                onClick={() => setPriceModal(false)}
                className="bg-red-500 text-white rounded-md p-2 px-4"
              />
            </div>
          </div>
        </div>
      )}

      {active && (
        <div className="fixed flex justify-center items-center w-full h-full bg-black/50 top-0 left-0">
          <div className="bg-white w-96 rounded-md shadow-2xl p-4 py-2">
            <div className="flex items-center justify-center gap-3 my-3">
              <span
                className={`px-4 py-2 rounded-full cursor-pointer ${
                  newActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setNewActive(true)}
              >
                Active
              </span>
              <span
                className={`px-4 py-2 rounded-full cursor-pointer ${
                  !newActive
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setNewActive(false)}
              >
                Inactive
              </span>
            </div>
            <div className="flex w-full justify-between gap-5">
              <input
                type="button"
                value="Save"
                onClick={() =>
                  updatedTeacherSub(
                    dataSubTeacher.teacherSub.price,
                    newActive,
                    dataSubTeacher.teacherSub.expire_date
                  ).then(() => setActive(false))
                }
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              />
              <input
                type="button"
                value="Cancel"
                onClick={() => setActive(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherSubscribe;
