import type { UserAuthProps } from '@/types/User'
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";

interface IUserAuthRepo {
  authUser(username: string, password: string): Promise<UserAuthProps>;
  refreshToken(token: TokenPayload): Promise<UserAuthProps>;
  logout(): void;
}

export type { IUserAuthRepo };
