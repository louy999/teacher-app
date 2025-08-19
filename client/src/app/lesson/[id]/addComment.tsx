"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiImageOn } from "react-icons/ci";
import Image from "next/image";
import { jwtVerify } from "jose";
import { getCookie } from "cookies-next/client";
import socket from "../../lib/socket";

interface AddCommentProps {
  lessonId: string;
  studentId: string;
}

interface UserPayload {
  user: {
    full_name: string;
  };
}

interface StudentPayload {
  student: {
    profile_pic: string;
  };
}

const AddComment: React.FC<AddCommentProps> = ({ lessonId, studentId }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [textInput, setTextInput] = useState("");
  const [errText, setErrText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const userDe = getCookie("UserDe");
  const dataRoleToken = getCookie("dataRoleToken");

  useEffect(() => {
    const validationUserToken = async () => {
      try {
        if (!dataRoleToken || !userDe) {
          throw new Error("Missing token data");
        }

        // JWT validation
        const userToken = await jwtVerify(
          dataRoleToken as string,
          new TextEncoder().encode(process.env.TOKEN_SECRET)
        );
        const StudentToken = await jwtVerify(
          userDe as string,
          new TextEncoder().encode(process.env.TOKEN_SECRET)
        );

        // Type assertion to `unknown` first, then to `UserPayload`
        const userPayload = userToken.payload as unknown as UserPayload;
        console.log(userPayload);

        // Ensure the required `user` property exists in the payload
        if (!userPayload.user) {
          throw new Error("User data is missing in the token");
        }

        // Type assertion to `unknown` first, then to `StudentPayload`
        const studentPayload =
          StudentToken.payload as unknown as StudentPayload;
        // console.log(studentPayload.roleData);

        // Ensure the required `student` property exists
        if (!studentPayload.roleData) {
          throw new Error("Student data is missing in the token");
        }

        setNameUser(userPayload.user.full_name); // No more type errors

        setImageSrc(studentPayload.roleData.profile_pic); // No more type errors
      } catch (error) {
        console.log(error);
      }
    };
    validationUserToken();
  }, [dataRoleToken, userDe]);

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

          await axios.post(`${process.env.local}/comments`, {
            text: textInput,
            user_id: studentId,
            lesson_id: lessonId,
            file_url: fetchFile.data,
            file_type: file.type.split("/")[0] === "image" ? "image" : "file",
            shown: false,
          });
        } else {
          await axios.post(`${process.env.local}/comments`, {
            text: textInput,
            user_id: studentId,
            lesson_id: lessonId,
            file_url: "",
            file_type: "",
            shown: false,
          });
          socket.emit("add_comment");
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
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-md shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Image
          width={40}
          height={40}
          src={`${process.env.img}/image/${imageSrc}`}
          alt="student profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold capitalize">{nameUser}</span>
      </div>

      <form className="flex items-center space-x-4">
        <textarea
          rows={2}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className={`${
            errText ? "border-red-400 border-4 duration-75 animate-pulse  " : ""
          } w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
          placeholder="Write your comment here..."
        />

        <label htmlFor="file-input" className="cursor-pointer">
          <CiImageOn size={24} className="text-gray-600 hover:text-gray-800" />
        </label>
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
      </form>

      {/* Show selected file name */}
      {file && (
        <div className="mt-2 text-sm text-gray-500">
          <span>
            {file.type.split("/")[1]}: {file.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default AddComment;
