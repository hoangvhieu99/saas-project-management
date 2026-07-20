import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/shared/db";
import { loginSchema } from "@/lib/auth/validators";

const providers = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }) as never,
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        // Auth.js JWT uses `picture`; session.user.image maps from token.picture (not token.image).
        token.picture = user.image ?? null;
      }

      if (trigger === "update" && session) {
        if ("name" in session && session.name !== undefined) {
          token.name = session.name as string | null;
        }
        if ("image" in session) {
          token.picture = (session.image as string | null | undefined) ?? null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = (token.name as string | null | undefined) ?? null;
        session.user.image = (token.picture as string | null | undefined) ?? null;
      }
      return session;
    },
  },
});
