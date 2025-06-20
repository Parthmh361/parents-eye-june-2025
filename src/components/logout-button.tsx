"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // clear state + token
    router.push("/login"); // redirect to login page
  };

  return (
    <button 
  onClick={handleLogout} 
  className="cursor-pointer bg-transparent text-black text-[120%] hover:bg-[#FFE58A] px-4 py-2 rounded-md transition-colors"
>
  Logout
</button>
  );
}
