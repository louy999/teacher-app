import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import NavMenu from "./navMenu";
import { GiBookAura } from "react-icons/gi";
import { jwtVerify } from "jose";
// import NotificationsClient from "./notificationsClient";

interface UserRole {
  full_name: string;
  profile_pic?: string; // Add profile_pic as optional
}

const NavBar = async () => {
  const cookieStore = await cookies();
  const userDe = cookieStore.get("UserDe");
  const dataRoleToken = cookieStore.get("dataRoleToken");

  if (userDe && dataRoleToken) {
    try {
      const userDeDecodedToken = await jwtVerify(
        userDe.value,
        new TextEncoder().encode(process.env.TOKEN_SECRET)
      );
      const dataRoleTokenDecodedToken = await jwtVerify(
        dataRoleToken.value,
        new TextEncoder().encode(process.env.TOKEN_SECRET)
      );
      const payloadUserDe = userDeDecodedToken.payload;
      const roleKeyUserDe = Object.keys(payloadUserDe)[0];

      const payloadDataRoleToken = dataRoleTokenDecodedToken.payload;
      const roleKey = Object.keys(payloadDataRoleToken)[0];

      const userRole = payloadDataRoleToken[roleKey] as UserRole;

      // Type assertion to ensure payloadUserDe[roleKeyUserDe] is of the right type
      const user = payloadUserDe[roleKeyUserDe] as { profile_pic?: string };

      // if (user && user.profile_pic) {
      return (
        <nav className="w-full relative left-2/4 -translate-x-2/4 flex justify-center items-center py-4 bg-white shadow-xl z-50">
          <div className="flex justify-between items-center w-full md:w-8/12 lg:w-6/12 px-4">
            <Link
              href="/"
              className="text-xl cursor-pointer font-bold text-[#4338CA] flex items-center gap-2"
            >
              <GiBookAura className="text-3xl" />
              <span className="text-black">Logo</span>
            </Link>

            <div className="flex items-center gap-3 relative  ">
              <Image
                src={`${process.env.img}/image/${user.profile_pic}`}
                alt="Profile Picture"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <NavMenu name={userRole.full_name} />
            </div>
          </div>
        </nav>
      );
    } catch (error) {
      console.error("Error decoding token:", error);
      return <div>Error decoding token, please try again later.</div>;
    }
  } else {
    return (
      <nav className="w-full flex justify-center items-center py-4 bg-white ">
        <div className="flex justify-between items-center w-full md:w-10/12  px-4">
          <Link
            href="/"
            className="text-xl cursor-pointer font-bold text-[#3B82F6] flex items-center gap-2"
          >
            <GiBookAura className="text-3xl" />
            <span className="text-black">Logo</span>
          </Link>
          <Link
            href="/login"
            className="text-base font-medium text-[#3B82F6] border border-[#3B82F6]  p-1 px-2 hover:bg-[#3B82F6] hover:text-white bg-white duration-500 rounded"
          >
            Sign up
          </Link>
        </div>
      </nav>
    );
  }
};

export default NavBar;
