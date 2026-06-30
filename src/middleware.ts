import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

// Protege todo /admin excepto /admin/login (evita loop de redirección)
export const config = {
  matcher: ["/admin/:path((?!login).*)"],
};
