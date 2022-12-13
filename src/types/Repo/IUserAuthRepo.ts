import type { UserAuthProps } from '@/types/User'

interface IUserAuthRepo {
  authUser(username: string, password: string): Promise<UserAuthProps>;
  refreshToken(token: string): Promise<{ token: string }>;
  logout(): void;
}

export type { IUserAuthRepo };
