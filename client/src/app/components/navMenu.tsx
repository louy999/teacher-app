"use client";
import React, { useState } from "react";
import Link from "next/link";
import { deleteCookie } from "cookies-next/client";

interface NavMenuProps {
  name: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ name }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        className="font-semibold capitalize cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {name}
      </span>
      <div
        onClick={() => setOpen(false)}
        className={`absolute left-0 w-32 capitalize bg-white shadow-2xl rounded-md flex flex-col duration-500 p-4 gap-2 z-10 ${
          open ? "top-16" : "-top-[100vh]"
        }`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="border-b-2 border-gray-200 pb-2 hover:pl-2 hover:text-gray-500 duration-500"
        >
          home
        </Link>
        <Link
          href="/profile"
          onClick={() => setOpen(false)}
          className="border-b-2 border-gray-200 pb-2 hover:pl-2 hover:text-gray-500 duration-500"
        >
          profile
        </Link>
        <div
          className="hover:pl-2 hover:text-gray-500 cursor-pointer duration-500"
          onClick={() => {
            deleteCookie("dataRoleToken");
            deleteCookie("UserDe");
            window.location.reload();
          }}
        >
          logout
        </div>
      </div>
    </>
  );
};

export default NavMenu;
