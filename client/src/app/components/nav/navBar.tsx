import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import NavMenu from "./navMenu";
import { GiBookAura } from "react-icons/gi";
import { LogIn } from "lucide-react";

const NavBar = async () => {
  // جلب الـ Headers التي تم إعدادها في الـ Middleware
  const headersList = await headers();
  const decodedToken = headersList.get("decoded-token");

  let userData = null;

  if (decodedToken) {
    try {
      // تحويل النص القادم من الـ Header إلى Object
      const parsedData = JSON.parse(decodedToken);
      
      // استخراج بيانات المستخدم (تأكد أن الـ Middleware يرسلها بهذا الشكل)
      const user = parsedData.user || parsedData;

      userData = {
        name: user.full_name || user.name || "User",
        profilePic: user.profile_pic,
        role: user.role, // الرتبة الصحيحة (teacher, student, etc.)
      };
    } catch (error) {
      console.error("Error parsing user data from headers:", error);
    }
  }

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform shadow-sm">
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
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-50 shadow-sm bg-indigo-50">
                  {userData.profilePic ? (
                    <Image
                      src={userData.profilePic}
                      alt="User Profile"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {userData.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {/* تمرير الاسم والرتبة بشكل صحيح */}
                <NavMenu name={userData.name} role={userData.role || "user"} />
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