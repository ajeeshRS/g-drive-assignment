"use client";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  const router = useRouter();
  const handleGoogleLogin = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`);
  };
  return (
    <div className="w-screen h-screen bg-neutral-900 flex items-center justify-center z-20">
      <button
        onClick={handleGoogleLogin}
        className="bg-neutral-800 text-white cursor-pointer rounded-lg px-3 py-2 flex items-center hover:bg-neutral-700"
      >
        <FcGoogle className="w-6 h-6 mr-2" /> Login with google
      </button>
    </div>
  );
}
