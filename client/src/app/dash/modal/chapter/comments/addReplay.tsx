import React, { useState, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";
import axios from "axios";
import socket from "../../../../lib/socket";

const AddReplay = ({ commentId }) => {
  const [errText, setErrText] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [idUser, setIdUser] = useState("");

  const userDe = getCookie("UserDe");

  useEffect(() => {
    const validationUserToken = async () => {
      try {
        if (!userDe) {
          throw new Error("Missing token data");
        }

        const StudentToken = await jwtVerify(
          userDe as string,
          new TextEncoder().encode(process.env.TOKEN_SECRET)
        );

        const studentPayload =
          StudentToken.payload as unknown as StudentPayload;

        // Ensure the required `student` property exists
        if (!studentPayload.roleData) {
          throw new Error("Student data is missing in the token");
        }

        setIdUser(studentPayload); // No more type errors
      } catch (error) {
        console.log(error);
      }
    };
    validationUserToken();
  }, [userDe]);

  const handelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const addCommentHandel = async () => {
    if (textInput) {
      setIsSubmitting(true);
      try {
        if (file) {
          const formData = new FormData();
          formData.append(
            file.type.split("/")[0] === "image" ? "image" : "file",
            file
          );

          const fetchFile = await axios.post(
            `${process.env.img}/upload/${
              file.type.split("/")[0] === "image" ? "image" : "file"
            }`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          await axios.post(`${process.env.local}/replay`, {
            comment_id: commentId,
            user_id: idUser.roleData.id,
            text: textInput,
            file_url: fetchFile.data,
            file_type: file.type.split("/")[0] === "image" ? "image" : "file",
          });
          socket.emit("add_replay");
        } else {
          await axios.post(`${process.env.local}/replay`, {
            comment_id: commentId,
            user_id: idUser.roleData.id,
            text: textInput,
            file_url: "",
            file_type: "",
          });
          socket.emit("add_replay");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
        setTextInput("");
        setFile(null);
      }
    } else {
      setErrText(true);
      setTimeout(() => {
        setErrText(false);
      }, 5000);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md">
      <div className="flex gap-3 items-center p-2 px-4 ">
        <textarea
          rows={2}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className={`${
            errText ? "border-red-400 border-4 duration-75 animate-pulse  " : ""
          } w-full p-3 rounded-md focus:shadow-2xl resize-none`}
          placeholder="Write your comment here..."
        />{" "}
        <label htmlFor="file-input" className="cursor-pointer">
          <CiImageOn size={24} className="text-gray-600 hover:text-gray-800" />
        </label>{" "}
        <input
          id="file-input"
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handelFile}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center cursor-pointer justify-center px-5 py-1 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission and handle manually
            addCommentHandel();
          }}
        >
          {isSubmitting ? <span>Submitting...</span> : <span>Post</span>}
        </button>
      </div>
      <div className="px-5 py-2">
        {file && (
          <div className="mt-2 text-sm text-gray-500">
            <span>
              {file.type.split("/")[1]}: {file.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddReplay;
