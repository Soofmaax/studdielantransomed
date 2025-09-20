import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, User } from '@prisma/client';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
        (token as any).id = (user as any).id;
      }
      
      const exp = Number((token as any).exp || 0);
      if (exp) {
        const shouldRefreshTime = exp - Math.floor(Date.now() / 1000) < 24 * 60 * 60;
        if (shouldRefreshTime) {
          return {
            ...(token as any),
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          } as any;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if ((token as any) && session.user) {
        (session.user as any).id = (token as any).id as string;
        (session.user as any).role = (token as any).role as User['role'];
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }
    },
  },
};
