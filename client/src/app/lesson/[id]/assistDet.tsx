import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { getCookie } from "cookies-next/client";

interface AssistData {
  profile_pic?: string;
  access_level?: string;
  name?: string;
}

interface AssistDetProps {
  assistantId: string;
}

// Define the type for `details`
interface DetailsData {
  role: string;
  full_name: string;
}

const AssistDet: React.FC<AssistDetProps> = ({ assistantId }) => {
  const [assistData, setAssistData] = useState<AssistData>({});
  const [details, setDetails] = useState<DetailsData>({
    role: "",
    full_name: "",
  }); // Type it as `DetailsData`

  useEffect(() => {
    const dataAssist = async () => {
      try {
        const response = await axios.get(
          `${process.env.local}/assistants/${assistantId}`
        );
        const det = await axios.get(
          `${process.env.local}/users/${assistantId}`,
          {
            headers: {
              Authorization: `${getCookie("dataRoleToken")}`,
            },
          }
        );
        setDetails(det.data.data); // Now TypeScript knows `details` has `role` and `full_name`

        setAssistData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    dataAssist();
  }, [assistantId]);

  return (
    <div className="flex gap-2">
      {assistData.profile_pic && (
        <Image
          src={`${process.env.img}/image/${assistData.profile_pic}`}
          alt="Attached file"
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
      )}
      <p>
        <span className="text-xs text-slate-500 mr-1">{details.role}:</span>
        <span className="font-bold capitalize">{details.full_name}</span>
      </p>
    </div>
  );
};

export default AssistDet;
