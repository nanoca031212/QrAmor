import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/minhas-paginas",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Após login, redireciona para /minhas-paginas
      if (url === baseUrl || url === `${baseUrl}/`) return `${baseUrl}/minhas-paginas`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/minhas-paginas`;
    },
  },
});

export { handler as GET, handler as POST };