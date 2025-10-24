"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const errorParam = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Email atau kata sandi tidak valid.";
      case "Your account has been blocked. Please contact the administrator.":
        return "Akun Anda telah diblokir. Silakan hubungi administrator.";
      default:
        return error || null;
    }
  };

  const initialError = getErrorMessage(errorParam);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || "/");
    } else {
      setErrorMessage(getErrorMessage(res?.error ?? null));
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* leftside */}
      <div className="hidden md:flex flex-col justify-center items-center bg-emerald-500/20 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-lg max-w-sm text-center">
          Stay on top of your nutrition goals with{" "}
          <span className="font-semibold text-emerald-500">NutriCare</span>.
        </p>

        <div className="mt-10 bg-white/80 p-3 rounded-xl shadow-md border border-gray-100">
          <Image
            src="/images/dashboard-mockup.png"
            alt="App Dashboard Preview"
            width={400}
            height={400}
            className="rounded-lg"
          />
          <p className="text-sm text-gray-600 mt-2 text-center font-medium">
            A glimpse of your personalized dashboard
          </p>
        </div>
      </div>

      {/* rightside */}
      <div className="flex items-center justify-center bg-foreground">
        <Card className="w-full max-w-sm shadow-lg bg-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-500">Welcome to NutriCare</CardTitle>
            <CardDescription className="text-gray-500">
              Silakan login untuk mengelola kesehatan dan nutrisi Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(errorMessage || initialError) && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>{errorMessage || initialError}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="m@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm text-emerald-600 underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="w-full flex justify-center">
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                Don’t have an account?{" "}
                <Button asChild variant="link" className="p-0 h-auto text-emerald-500 hover:text-emerald-600">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v2a3 3 0 01-6 0v-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13v-2a7 7 0 0114 0v2m-7 8h.01"
                  />
                </svg>
                We value your privacy. Your data is safe with us.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-gray-500">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
