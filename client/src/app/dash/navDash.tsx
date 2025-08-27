/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";

const NavDash = () => {
  const router = useRouter();
  const tokenRole = getCookie("dataRoleToken");
  const userDe = getCookie("UserDe");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams.get("user");

  const [accessAssets, setAccessAssets] = useState<string[]>([]);

  useEffect(() => {
    async function checkAndRedirect() {
      if (pathname === "/dash") {
        if (!tokenRole || !userDe) return;

        const decodedToken: any = await jwtVerify(
          tokenRole as string,
          new TextEncoder().encode(process.env.TOKEN_SECRET)
        );
        const userDeDecodedToken: any = await jwtVerify(
          userDe as string,
          new TextEncoder().encode(process.env.TOKEN_SECRET)
        );

        const userRole = decodedToken.payload.user.role;
        const allowedAccess: string[] =
          userDeDecodedToken.payload.roleData.access || [];

        // teacher has full access
        if (userRole === "teachers") {
          setAccessAssets(["students", "parents", "assistants", "chapters"]);
          return;
        }

        // assistants logic
        if (userRole === "assistants") {
          setAccessAssets(allowedAccess);

          if (
            !allowedAccess.includes("students") &&
            !allowedAccess.includes("parents") &&
            !allowedAccess.includes("assistants")
          ) {
            router.replace("/dash/chapters");
            return;
          }

          if (!search) {
            if (allowedAccess.includes("students")) {
              router.replace("/dash?user=student");
            } else if (allowedAccess.includes("parents")) {
              router.replace("/dash?user=parent");
            } else if (allowedAccess.includes("assistants")) {
              router.replace("/dash?user=assistant");
            }
            return;
          }

          if (
            (search === "student" && !allowedAccess.includes("students")) ||
            (search === "parent" && !allowedAccess.includes("parents")) ||
            (search === "assistant" && !allowedAccess.includes("assistants"))
          ) {
            if (allowedAccess.includes("students")) {
              router.replace("/dash?user=student");
            } else if (allowedAccess.includes("parents")) {
              router.replace("/dash?user=parent");
            } else if (allowedAccess.includes("assistants")) {
              router.replace("/dash?user=assistant");
            }
          }
        }
      }
    }
    checkAndRedirect();
  }, [pathname, search, tokenRole, userDe, router, searchParams]);

  return (
    <div className="w-fill my-5 flex justify-center items-center">
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
                ? "w-fit gap-3 bg-white items-center p-2 border-l"
                : "w-[0px]"
            } `}
          >
            {accessAssets.includes("students") && (
              <li
                className={`hover:bg-slate-100 p-1 rounded-md duration-300 ${
                  search === "student" ? "bg-slate-100 p-1 rounded-md" : ""
                }`}
              >
                <Link className="capitalize" href="?user=student">
                  student
                </Link>
              </li>
            )}
            {accessAssets.includes("parents") && (
              <li
                className={`hover:bg-slate-100 p-1 rounded-md duration-300 ${
                  search === "parent" ? "bg-slate-100 p-1 rounded-md" : ""
                }`}
              >
                <Link className="capitalize" href="?user=parent">
                  parent
                </Link>
              </li>
            )}
            {accessAssets.includes("assistants") && (
              <li
                className={`hover:bg-slate-100 p-1 rounded-md duration-300 ${
                  search === "assistant" ? "bg-slate-100 p-1 rounded-md" : ""
                }`}
              >
                <Link className="capitalize" href="?user=assistant">
                  assistant
                </Link>
              </li>
            )}
          </div>

          {accessAssets.includes("chapters") && (
            <li
              className={`${
                pathname === "/dash/chapters" ? "bg-white p-2" : "p-2"
              } hover:bg-white rounded-md duration-200 hover:p-2 `}
            >
              <Link href="/dash/chapters">Chapters</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavDash;
