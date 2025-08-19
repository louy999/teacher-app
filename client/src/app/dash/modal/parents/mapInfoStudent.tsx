import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next/client";

const MapInfoStudent = ({ id }) => {
  const [dataStudent, setDataStudent] = useState([]);
  useEffect(() => {
    const allDataFetch = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/users/${id.student_id}`,
          {
            headers: {
              Authorization: `${getCookie("dataRoleToken")}`,
            },
          }
        );
        setDataStudent(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    allDataFetch();
  }, [id.student_id]);
  return <option value={dataStudent.id}>{dataStudent.full_name}</option>;
};

export default MapInfoStudent;
