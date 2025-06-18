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
    <Button variant="outline" onClick={handleLogout} className="cursor-pointer">
      Logout
    </Button>
  );
}
