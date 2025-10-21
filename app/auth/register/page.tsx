"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/auth/signin");
    } else {
      console.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* left */}
      <div className="hidden md:flex flex-col justify-center items-center bg-emerald-500/20 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Join NutriCare Today!</h1>
        <p className="text-lg max-w-sm text-center">
          Start your journey toward a healthier, balanced lifestyle with{" "}
          <span className="font-semibold text-emerald-500">NutriCare</span>.
        </p>

       <div className="mt-10 bg-white/80 p-3 rounded-xl shadow-md border border-gray-100">
          <Image
            src="/images/register.png"
            alt="App Dashboard Preview"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
        <p className="text-sm text-gray-300 mt-6 text-center max-w-xs">
          🔒 We value your privacy. Your data is safe with us.
        </p>
      </div>
      <div className="flex items-center justify-center bg-foreground">
        <Card className="w-full max-w-sm bg-emerald-500/20 border-none">
          <CardHeader>
            <CardTitle className="text-emerald-500">Create an account</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in your details to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-emerald-500">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-emerald-500">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-emerald-500">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-500/80" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="w-full flex justify-center">
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
              Already have an account?{" "}
              <Button asChild variant="link" className="p-0 h-auto text-emerald-500">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
