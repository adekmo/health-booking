import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "customer" | "nutritionist" | "admin";
      photo?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: "customer" | "nutritionist" | "admin";
    photo?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "customer" | "nutritionist" | "admin";
    photo?: string | null;
  }
}
