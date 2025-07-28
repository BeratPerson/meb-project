import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface CustomUser extends User {
  jobTitle?: string;
  tcKimlikNo?: string;
  userRole?: 'MEB_YONETICI' | 'BURSIYER' | 'MENTOR';
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tcKimlikNo: user.tcKimlikNo,
          userRole: user.userRole,
          accounts: [],
        } as User;
      }
    })
  ],
  callbacks: {
    async jwt({ token, trigger, session, account, user }) {
      // Initial sign-in
      if (account && user) {
        token.userId = user.id;
        const userFromDb = await prisma.user.findUnique({
          where: { email: user.email as string },
        });
        if (userFromDb?.jobTitle) {
          token.jobTitle = userFromDb.jobTitle;
        }
        if (userFromDb?.tcKimlikNo) {
          token.tcKimlikNo = userFromDb.tcKimlikNo;
        }
        if (userFromDb?.userRole) {
          token.userRole = userFromDb.userRole;
        }
      }
      // Triggers
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      if (trigger === 'update' && session?.jobTitle) {
        token.jobTitle = session.jobTitle;
      }
      return token;
    },
    // Custom Session
    async session({session, token}) {
      if (token?.userId) {
        (session.user as CustomUser).id = token.userId as string;
      }
      if (token?.jobTitle) {
        (session.user as CustomUser).jobTitle = token.jobTitle as string;
      }
      if (token?.tcKimlikNo) {
        (session.user as CustomUser).tcKimlikNo = token.tcKimlikNo as string;
      }
      if (token?.userRole) {
        (session.user as CustomUser).userRole = token.userRole as 'MEB_YONETICI' | 'BURSIYER' | 'MENTOR';
      }
      return session;
    },
  },
}
