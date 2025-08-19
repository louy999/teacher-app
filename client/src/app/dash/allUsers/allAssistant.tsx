/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import axios from "axios";

const AllAssistant = ({ assist }: any) => {
  const [dataUser, setDataUser] = useState({});
  useEffect(() => {
    const getAssist = async () => {
      try {
        const res = await axios.get(`${process.env.local}/users/${assist.id}`, {
          headers: {
            Authorization: `${getCookie("dataRoleToken")}`,
          },
        });
        setDataUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAssist();
  }, [assist.id]);
  return (
    <>
      <tr className={`border-t border-t-[#dbe1e6]   `}>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
          {dataUser.full_name}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {dataUser.phone}
        </td>

        <td className="cursor-pointer table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 h-[72px] px-4 py-2 w-60 text-[#60768a] text-sm font-bold leading-normal tracking-[0.015em]">
          Edit
        </td>
      </tr>
    </>
  );
};

export default AllAssistant;
