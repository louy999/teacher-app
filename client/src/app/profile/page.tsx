"use client";

import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { jwtVerify } from "jose";
import { useRouter } from "next/navigation";
import FamilyProfile from "./familyProfile";

interface TokenData {
  role: string;
  id: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const role = getCookie("dataRoleToken");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  useEffect(() => {
    const getTokenVerify = async () => {
      if (!role) {
        console.log("No role found");
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = await jwtVerify(
          role,
          new TextEncoder().encode(process.env.TOKEN_SECRET)
        );
        setTokenData(decodedToken.payload.user);
      } catch (error) {
        console.log(error);
      }
    };

    getTokenVerify();
  }, [role]);
  console.log(tokenData);

  useEffect(() => {
    if (tokenData) {
      if (tokenData.role === "students") {
        router.push(`/profile/${tokenData.id}`);
      } else if (tokenData.role === "parents") {
        return;
      } else {
        router.push(`/`);
      }
    }
  }, [tokenData, router]);

  return (
    <div>
      {!tokenData && <p>Loading...</p>}
      {tokenData && tokenData.role === "parents" && <FamilyProfile />}
    </div>
  );
};

export default ProfilePage;
