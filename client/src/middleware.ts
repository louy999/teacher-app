import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define the expected shape of the decoded token payload
interface DecodedPayload {
  user: {
    role: string;
  };
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("dataRoleToken");
  const userDeToken = request.cookies.get("UserDe");

  if (token) {
    try {
      const decodedToken = await jwtVerify(
        token.value,
        new TextEncoder().encode(process.env.TOKEN_SECRET)
      );
      const userDet = await jwtVerify(
        userDeToken.value,
        new TextEncoder().encode(process.env.TOKEN_SECRET)
      );

      // Type assertion to `unknown` first, then to `DecodedPayload`
      const payload = decodedToken.payload as unknown as DecodedPayload;
      const payloadUser = userDet.payload as unknown as DecodedPayload;

      // Ensure the `user` property exists in the payload
      if (!payload.user) {
        throw new Error("User data missing in decoded token");
      }

      const role = payload.user.role;

      const response = NextResponse.next();
      response.headers.set(
        "decoded-token",
        JSON.stringify(decodedToken.payload)
      );
      response.headers.set("user-token", JSON.stringify(payloadUser.roleData));

      // Check the role and redirect based on the pathname
      if (request.nextUrl.pathname === "/") {
        if (role === "teachers") {
          return NextResponse.redirect(new URL("/dash", request.url));
        }
        if (role === "parents") {
          return NextResponse.redirect(new URL("/profile", request.url));
        }
        if (role === "assistants") {
          return NextResponse.redirect(new URL("/dash", request.url));
        }
      }

      if (
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/register"
      ) {
        if (role === "teachers") {
          return NextResponse.redirect(new URL("/dash", request.url));
        }
        if (role === "students") {
          return NextResponse.redirect(new URL("/", request.url));
        }
        if (role === "parents") {
          return NextResponse.redirect(new URL("/profile", request.url));
        }
        if (role === "assistant") {
          return NextResponse.redirect(new URL("/dash", request.url));
        }
      }

      if (request.nextUrl.pathname.startsWith("/dash")) {
        if (role === "student") {
          return NextResponse.redirect(new URL("/", request.url));
        }
        if (role === "parent") {
          return NextResponse.redirect(new URL("/profile", request.url));
        }
      }

      return response;
    } catch (error) {
      console.log("Token verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If no token, allow login or register pages
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/lesson/:path*",
    "/profile/:path*",
    "/exam/:path*",
    "/dash/:path*",
  ],
};
