import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "customer" | "nutritionist" | "admin";
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: "customer" | "nutritionist" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "customer" | "nutritionist" | "admin";
  }
}
