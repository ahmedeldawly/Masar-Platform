import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Route-prefix -> allowed roles map. Extend as new protected areas are added.
const ROLE_RULES: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/instructor", roles: ["ADMIN", "INSTRUCTOR"] },
  { prefix: "/dashboard", roles: ["ADMIN", "INSTRUCTOR", "STUDENT"] },
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    const rule = ROLE_RULES.find((r) => pathname.startsWith(r.prefix));
    if (rule && (!role || !rule.roles.includes(role))) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only require a valid token; role checks happen above so we can
      // redirect to a friendly 403 instead of the default sign-in bounce.
      authorized: ({ token }) => !!token && token.error !== "ACCOUNT_SUSPENDED",
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/instructor/:path*", "/admin/:path*"],
};
