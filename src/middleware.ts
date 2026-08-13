import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default function middleware(req: any) {
  return withAuth(req, {
    isReturnToCurrentPage: true,
    loginPage: "/login",
  });
}

export const config = {
  matcher: [
    // Protect these routes and all sub-routes
    "/doctor-dashboard/:path*",
    "/worker-dashboard/:path*",
  ],
};
