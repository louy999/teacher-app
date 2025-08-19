/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";

const ExamImage = ({
  currentQuestion,
  setEditImage,
}: {
  currentQuestion: any;
  setEditImage: (file: File | null) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  console.log(preview);

  return (
    <div className="flex justify-center items-center flex-col mb-4">
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="border my-2 rounded-md p-2"
      />

      {preview ? (
        <Image
          src={preview}
          alt="Preview Image"
          width={300}
          height={300}
          className="rounded border"
        />
      ) : (
        currentQuestion?.file_url && (
          <Image
            src={`${process.env.img}/image/${currentQuestion.file_url}`}
            alt="Question Image"
            width={300}
            height={300}
            className="rounded border"
          />
        )
      )}
    </div>
  );
};

export default ExamImage;
