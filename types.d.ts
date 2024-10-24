import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string; // Change to number since it's an integer in the database
    email: string;
    role: string; // Add the role property here
    name?: string | null;
    image?: string | null;
  }
  
  interface Session {
    user: User;
  }
}
