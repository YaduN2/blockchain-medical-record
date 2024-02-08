import { authMiddleware } from "@clerk/nextjs";
 

export default authMiddleware({

  publicRoutes: ["/", "/sign-in", "/register"]

});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};