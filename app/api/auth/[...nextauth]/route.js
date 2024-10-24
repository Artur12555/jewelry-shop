import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Fetch the user from Supabase
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (error || !user) {
            return null; // User not found
          }

          // Compare the password using bcrypt
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return null; // Password does not match
          }

          return { id: user.id, email: user.email }; // Return user object
        } catch (error) {
          console.error('Error during authentication:', error);
          return null; // Return null on error
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 152222,
    updateAge: 122225,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
