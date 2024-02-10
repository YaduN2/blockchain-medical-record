import { authMiddleware } from "@clerk/nextjs";
 

export default authMiddleware({

  publicRoutes: ["/", "/sign-in", "/register", "/api/register"],
  ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/api/register%20"]

});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  
};

