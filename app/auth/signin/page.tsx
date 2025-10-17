"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "Your account has been blocked. Please contact the administrator.":
        return "Your account has been blocked. Please contact the administrator.";
      default:
        return error || null;
    }
  };

  const initialError = getErrorMessage(errorParam);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // biar bisa handle manual
    });
    setLoading(false);

    if (res?.ok) {
      router.push("/");
    } else {
      if (res?.error === "Your account has been blocked. Please contact the administrator.") {
        setErrorMessage("Your account has been blocked. Please contact the administrator.");
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-sm bg-emerald-500/20 border-none">
        <CardHeader >
          <CardTitle className="text-emerald-500">Login to your account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email below to login to your account
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
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-emerald-500">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-emerald-500">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-gray-400 underline-offset-4 hover:underline"
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
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-500/80" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            variant="outline"
            className="w-full text-emerald-500 hover:text-emerald-500/80"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Login with Google
          </Button>
          <div className="w-full flex justify-center">
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
              Don’t have an account?{" "}
              <Button asChild variant="link" className="p-0 h-auto text-emerald-500">
                <Link href="/auth/register" >Sign Up</Link>
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
