/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";

type AccessAsset =
  | "students"
  | "parents"
  | "assistants"
  | "chapters"
  | "lessons"
  | "teachers"
  | "subscribe";

const NavDash = () => {
  const router = useRouter();
  const tokenRole = getCookie("dataRoleToken");
  const userDe = getCookie("UserDe");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams.get("user");

  const [accessAssets, setAccessAssets] = useState<AccessAsset[]>([]);

  // --- Effect Hook remains unchanged (handles auth/redirect logic) ---
  useEffect(() => {
    async function checkAndRedirect() {
      if (!tokenRole || !userDe) return;

      const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);

      try {
        const decodedToken: any = await jwtVerify(tokenRole as string, SECRET);
        const userDeDecodedToken: any = await jwtVerify(
          userDe as string,
          SECRET
        );

        const userRole = decodedToken.payload.user.role;
        const allowedAccess: AccessAsset[] =
          userDeDecodedToken.payload.roleData.access || [];

        const redirectToFirstAllowedUser = () => {
          if (allowedAccess.includes("students")) {
            router.replace("/dash?user=student");
            return true;
          } else if (allowedAccess.includes("parents")) {
            router.replace("/dash?user=parent");
            return true;
          } else if (allowedAccess.includes("assistants")) {
            router.replace("/dash?user=assistant");
            return true;
          }
          return false;
        };

        if (userRole === "teachers") {
          // Type assertion for clarity
          setAccessAssets([
            "students",
            "parents",
            "assistants",
            "chapters",
            "lessons",
            "teachers",
          ] as AccessAsset[]);
          return;
        }

        if (userRole === "assistants") {
          setAccessAssets(allowedAccess);

          const hasUserAccess = allowedAccess.some((a) =>
            ["students", "parents", "assistants"].includes(a)
          );
          const hasChapterAccess = allowedAccess.includes("chapters");
          const hasSubscribeAccess =
            allowedAccess.includes("subscribe") ||
            allowedAccess.includes("lessons");

          if (pathname === "/dash") {
            if (!hasUserAccess && (hasChapterAccess || hasSubscribeAccess)) {
              router.replace(hasChapterAccess ? "/dash/chapters" : "/dash/sub");
              return;
            }

            if (!search && hasUserAccess) {
              redirectToFirstAllowedUser();
              return;
            }

            if (
              (search === "student" && !allowedAccess.includes("students")) ||
              (search === "parent" && !allowedAccess.includes("parents")) ||
              (search === "assistant" && !allowedAccess.includes("assistants"))
            ) {
              redirectToFirstAllowedUser();
            }
          }

          if (pathname === "/dash/chapters" && !hasChapterAccess) {
            if (hasSubscribeAccess) {
              router.replace("/dash/sub?user=lesson");
            } else if (hasUserAccess) {
              redirectToFirstAllowedUser();
            }
            return;
          }

          if (pathname === "/dash/sub" && !hasSubscribeAccess) {
            if (hasChapterAccess) {
              router.replace("/dash/chapters");
            } else if (hasUserAccess) {
              redirectToFirstAllowedUser();
            }
            return;
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
      }
    }
    checkAndRedirect();
  }, [pathname, search, tokenRole, userDe, router, searchParams]);

  // --- Render logic for Navigation ---
  const isDashActive = pathname === "/dash";
  const isChaptersActive = pathname === "/dash/chapters";
  const isSubActive = pathname === "/dash/sub";

  const hasChapterAccess = accessAssets.includes("chapters");
  const hasSubscribeAccess =
    accessAssets.includes("lessons") ||
    accessAssets.includes("teachers") ||
    accessAssets.includes("subscribe");

  return (
    <div className="w-full my-5 flex justify-center items-center">
      {/* Responsive Width: w-11/12 on mobile, md:w-9/12 on medium screens,
        and lg:w-fit for large screens, ensuring the nav bar never takes 
        up too much space unless needed. 
      */}
      <div className="w-11/12 md:w-9/12 lg:w-fit">
        {/* Main Nav Container: Added 'whitespace-nowrap' to prevent links 
          from wrapping onto new lines on small screens, forcing horizontal 
          scroll when needed, which is handled by 'overflow-x-auto'.
        */}
        <ul className="flex gap-5 duration-200 bg-slate-200 p-3 px-5 shadow-2xl rounded-md overflow-x-auto whitespace-nowrap">
          {/* USERS Link and Sub-links */}
          {(accessAssets.includes("students") ||
            accessAssets.includes("parents") ||
            accessAssets.includes("assistants")) && (
            <>
              {/* Primary Link container uses 'flex items-center' for layout consistency */}
              <div className="flex items-center">
                <li
                  className={`${
                    isDashActive ? "bg-white p-2" : "py-2"
                  } hover:bg-white rounded-md duration-200 hover:p-2`}
                >
                  <Link href="/dash?user=student">Users</Link>
                </li>

                {/* Sub-menu Container: Refined the active state to use 'max-w-full' for a smoother transition
                  than a fixed 'w-fit' and clearer 'hidden'/'flex' toggle. 
                */}
                <div
                  className={`duration-300 flex items-center border-l ml-3 ${
                    isDashActive
                      ? "max-w-full gap-3 bg-white p-2" // Show state
                      : "max-w-0 overflow-hidden" // Hidden state
                  }`}
                >
                  {accessAssets.includes("students") && (
                    <li
                      className={`p-1 rounded-md duration-300 ${
                        search === "student"
                          ? "bg-slate-100 font-semibold"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <Link className="capitalize" href="?user=student">
                        student
                      </Link>
                    </li>
                  )}
                  {accessAssets.includes("parents") && (
                    <li
                      className={`p-1 rounded-md duration-300 ${
                        search === "parent"
                          ? "bg-slate-100 font-semibold"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <Link className="capitalize" href="?user=parent">
                        parent
                      </Link>
                    </li>
                  )}
                  {accessAssets.includes("assistants") && (
                    <li
                      className={`p-1 rounded-md duration-300 ${
                        search === "assistant"
                          ? "bg-slate-100 font-semibold"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <Link className="capitalize" href="?user=assistant">
                        assistant
                      </Link>
                    </li>
                  )}
                </div>
              </div>
            </>
          )}

          {/* CHAPTERS Link */}
          {hasChapterAccess && (
            <li
              className={`${
                isChaptersActive ? "bg-white p-2 font-semibold" : "p-2"
              } hover:bg-white rounded-md duration-200 hover:p-2`}
            >
              <Link href="/dash/chapters">Chapters</Link>
            </li>
          )}

          {/* SUBSCRIBE Link and Sub-links */}
          {hasSubscribeAccess && (
            <div className="flex items-center">
              <li
                className={`${
                  isSubActive ? "bg-white p-2 font-semibold" : "p-2"
                } hover:bg-white rounded-md duration-200 hover:p-2`}
              >
                <Link href="/dash/sub?user=lesson">Subscribe</Link>
              </li>

              <div
                className={`duration-300 flex items-center border-l ml-3 ${
                  isSubActive
                    ? "max-w-full gap-3 bg-white p-2" // Show state
                    : "max-w-0 overflow-hidden" // Hidden state
                }`}
              >
                {accessAssets.includes("lessons") && (
                  <li
                    className={`p-1 rounded-md duration-300 ${
                      search === "lesson"
                        ? "bg-slate-100 font-semibold"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <Link className="capitalize" href="?user=lesson">
                      lessons
                    </Link>
                  </li>
                )}
                {accessAssets.includes("teachers") && (
                  <li
                    className={`p-1 rounded-md duration-300 ${
                      search === "teacher"
                        ? "bg-slate-100 font-semibold"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <Link className="capitalize" href="?user=teacher">
                      teacher
                    </Link>
                  </li>
                )}
              </div>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavDash;
