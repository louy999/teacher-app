"use client";

import { useRouter } from "next/navigation";

const GoHomeButton = () => {
  const router = useRouter();

  const handleGoTo = () => {
    router.push("/");
  };

  return (
    <button onClick={handleGoTo} style={{ marginTop: "20px" }}>
      Go To Home
    </button>
  );
};

export default GoHomeButton;
