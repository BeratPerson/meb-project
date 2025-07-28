// next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    jobTitle?: string;
    tcKimlikNo?: string;
    userRole?: 'MEB_YONETICI' | 'BURSIYER' | 'MENTOR';
    accounts: Account[];
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    jobTitle?: string;
    tcKimlikNo?: string;
    userRole?: 'MEB_YONETICI' | 'BURSIYER' | 'MENTOR';
  }

  interface Account {
    provider: string;
  }
}
