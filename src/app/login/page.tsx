"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser } from "@/services/userService";
import Image from "next/image";
import { Eye, EyeOff, Fullscreen } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password); // 🟢 API call

      if (data?.token) {
        login(); // update Zustand store
        document.cookie = `token=${data.token}; path=/`; // save token
        router.push("/dashboard");
      } else {
        alert("Invalid response from server.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <Image
        src="/background.svg"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="flex flex-col items-center gap-4">
        <div>
          <Image
            src="/logo.svg"
            alt="ParentsEye Logo"
            width={200}
            height={200}
            priority
          />
        </div>
        <div>
          <Card className="w-full max-w-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Login to Parentseye
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Your Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full cursor-pointer">
                  Login
                </Button>
              </form>
              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <u>
                    <Link href="#">Terms</Link>
                  </u>{" "}
                  and{" "}
                  <u>
                    <Link href="#">Privacy Policy</Link>
                  </u>
                  .
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
