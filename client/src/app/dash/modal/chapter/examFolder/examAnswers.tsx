import React from "react";
import { FaCheckDouble } from "react-icons/fa";
import { IoMdAddCircle, IoMdTrash } from "react-icons/io";

const ExamAnswers = ({
  editAnswers,
  setEditAnswers,
  correctAnser,
  setCorrectAnser,
}: {
  editAnswers: string[];
  setEditAnswers: (val: string[]) => void;
  correctAnser: string;
  setCorrectAnser: (val: string) => void;
}) => {
  const handleAnswerChange = (i: number, newValue: string) => {
    const updated = [...editAnswers];
    updated[i] = newValue;
    setEditAnswers(updated);
  };

  const handleAddAnswer = () => {
    setEditAnswers([...editAnswers, ""]);
  };

  const handleDeleteAnswer = (i: number) => {
    const updated = editAnswers.filter((_, idx) => idx !== i);
    setEditAnswers(updated);
    if (correctAnser === editAnswers[i]) {
      setCorrectAnser("");
    }
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Answers:</label>
      <div className="space-y-2">
        {editAnswers.map((ans: string, i: number) => (
          <div
            key={i}
            className={`flex items-center justify-between w-full p-2 ${
              correctAnser === ans ? "border-green-300 border-2" : "border"
            } rounded`}
          >
            <input
              type="text"
              className="w-full p-2 border rounded mr-2"
              value={ans}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
            />
            <div className="flex gap-2 items-center">
              {correctAnser === ans ? (
                <div
                  className="w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center bg-green-500"
                  onClick={() => setCorrectAnser(ans)}
                >
                  <FaCheckDouble className="text-white" />
                </div>
              ) : (
                <div
                  className="w-8 h-8 cursor-pointer bg-white rounded-full border flex items-center justify-center"
                  onClick={() => setCorrectAnser(ans)}
                ></div>
              )}
              <IoMdTrash
                className="cursor-pointer text-red-500 w-6 h-6"
                onClick={() => handleDeleteAnswer(i)}
              />
            </div>
          </div>
        ))}
        <div
          className="flex items-center gap-2 cursor-pointer text-blue-600 mt-2"
          onClick={handleAddAnswer}
        >
          <IoMdAddCircle className="w-6 h-6" /> Add Answer
        </div>
      </div>
    </div>
  );
};

export default ExamAnswers;
