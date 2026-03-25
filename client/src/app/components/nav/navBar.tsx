import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import NavMenu from "./navMenu";
import { GiBookAura } from "react-icons/gi";
import { jwtVerify } from "jose";
import { User, LogIn } from "lucide-react"; 

interface UserRole {
  full_name: string;
  profile_pic?: string;
  role?:string;
}

const NavBar = async () => {
  const cookieStore = await cookies();
  const userDe = cookieStore.get("UserDe");
  const dataRoleToken = cookieStore.get("dataRoleToken");

  let userData = null;

  if (userDe && dataRoleToken) {
    try {
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
      const { payload: payloadUserDe } = await jwtVerify(userDe.value, secret);
      const { payload: payloadRole } = await jwtVerify(dataRoleToken.value, secret);

      const roleKey = Object.keys(payloadRole)[0];
      const userKey = Object.keys(payloadUserDe)[0];
      userData = {
        name: (payloadRole[roleKey] as UserRole).full_name,
        profilePic: (payloadUserDe[userKey] as { profile_pic?: string }).profile_pic,
 role: (payloadRole[roleKey] as UserRole).role,    
  };
    } catch (error) {
      console.error("Token Error:", error);
    }
  }
  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <GiBookAura size={24} />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              ACADEMY<span className="text-indigo-600">.</span>
            </span>
          </Link>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 group cursor-pointer">
                  {userData.profilePic ? (
                    <Image
                      src={`${userData.profilePic}`}
                      alt="User"
                      width={200}
                      height={200}
                      className="rounded-full object-cover border-2 border-indigo-50 group-hover:border-indigo-200 transition-colors"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                      {userData.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <NavMenu name={userData.name}  role={userData.name}/>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                <LogIn size={18} />
                <span>Join Now</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;