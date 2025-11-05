import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      organizationId: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    organizationId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    organizationId: string | null;
  }
}

