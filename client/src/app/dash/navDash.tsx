"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NavDash = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams.get("user");
  useEffect(() => {
    if (pathname === "/dash") {
      if (!searchParams.has("user")) {
        router.push("/dash?user=student");
      }
    }
  }, [pathname, router, searchParams]);
  return (
    <div className="w-fill my-5  flex justify-center items-center">
      <div>
        <ul className="flex gap-5 duration-200 bg-slate-200 p-3 px-5 shadow-2xl rounded-md">
          <li
            className={`${
              pathname === "/dash" ? "bg-white p-2" : "py-2"
            } hover:bg-white rounded-md duration-200 hover:p-2 `}
          >
            <Link href="/dash?user=student">Users</Link>
          </li>
          <div
            className={` duration-300 flex rounded-br-md rounded-tr-sm overflow-hidden ${
              pathname === "/dash"
                ? "w-fit  gap-3 bg-white items-center p-2 border-l"
                : "w-[0px]"
            } `}
          >
            <li
              className={`hover:bg-slate-100 p-1 rounded-md duration-300 ${
                search === "student" ? "bg-slate-100 p-1 rounded-md" : ""
              }`}
            >
              <Link className="capitalize" href="?user=student">
                student
              </Link>
            </li>
            <li
              className={`hover:bg-slate-100 p-1 rounded-md duration-300 ${
                search === "parent" ? "bg-slate-100 p-1 rounded-md" : ""
              }`}
            >
              <Link className="capitalize" href="?user=parent">
                parent
              </Link>
            </li>
            <li
              className={`hover:bg-slate-100 p-1 rounded-md duration-300 ${
                search === "assistant" ? "bg-slate-100 p-1 rounded-md" : ""
              }`}
            >
              <Link className="capitalize" href="?user=assistant">
                assistant
              </Link>
            </li>
          </div>
          <li
            className={`${
              pathname === "/dash/chapters" ? "bg-white p-2" : "p-2"
            } hover:bg-white rounded-md duration-200 hover:p-2 `}
          >
            <Link href="/dash/chapters">Chapters</Link>
          </li>
          {/* <li
            className={`${
              pathname === "/dash/exams" ? "bg-white p-2" : "p-2"
            } hover:bg-white rounded-md duration-200 hover:p-2 `}
          >
            <Link href="/dash/exams">Exams</Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default NavDash;
