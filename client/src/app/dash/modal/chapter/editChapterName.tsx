import React from "react";

const EditChapterName = ({
  setOpenModelEditChapter,
  setNewName,
  newName,
  onSubmitEdit,
  loading,
}: {
  setOpenModelEditChapter: (v: boolean) => void;
  setNewName: (v: string) => void;
  newName: string;
  loading: boolean;
  onSubmitEdit: () => void;
}) => {
  return (
    <div className="fixed w-screen h-screen flex justify-center items-center top-0 left-0 bg-black/50 ">
      <div className="bg-white shadow-2xl rounded-md w-fit">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Edit Chapter Name</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitEdit();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="chapterName">
                Chapter Name
              </label>
              <input
                type="text"
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
                id="chapterName"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter chapter name"
              />
            </div>
            <div className="flex gap-5 justify-between items-center">
              {!loading ? (
                <button
                  type="submit"
                  className="py-2 cursor-pointer w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Save Changes
                </button>
              ) : (
                <button className="py-2 cursor-pointer w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                  Loading...{" "}
                </button>
              )}
              <button
                onClick={() => setOpenModelEditChapter(false)}
                className="py-2 cursor-pointer w-full bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                type="button"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditChapterName;
