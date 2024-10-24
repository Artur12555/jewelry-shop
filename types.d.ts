declare module 'next-auth' {
  interface User {
    id: string; // Change to number since it's an integer in the database
    email: string;
    name?: string | null;
    image?: string | null;
  }
  
  interface Session {
    user: User;
  }
}
