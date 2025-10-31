/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import EditAssistantModal from "../modal/assistants/editAssistantModal";

const AllAssistant = ({ assist }: any) => {
  const [openModalEditAssistant, setOpenModalEditAssistant] = useState(false);

  return (
    <>
      <tr className={`border-t border-t-[#dbe1e6]   `}>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
          {assist.extraDataUser.full_name}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {assist.extraDataUser.phone}
        </td>
        <td className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
          {assist.extraDataAccess.access?.join(" , ")}
        </td>

        <td
          onClick={() => setOpenModalEditAssistant(true)}
          className="cursor-pointer table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 h-[72px] px-4 py-2 w-60 text-[#60768a] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          Edit
        </td>
      </tr>
      {openModalEditAssistant && (
        <EditAssistantModal
          assist={assist}
          dataUser={assist.extraDataUser}
          setOpenModalEditAssistant={setOpenModalEditAssistant}
        />
      )}
    </>
  );
};

export default AllAssistant;
