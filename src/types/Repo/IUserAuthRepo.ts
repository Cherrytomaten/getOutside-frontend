import type { UserAuthProps } from '@/types/User'
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { WrapperServerErrorResponse } from "@/types/Server/WrapperServerErrorResponse";
import { ResetPasswordProps } from "@/types/User/ResetPasswordProps";

interface IUserAuthRepo {
  authUser(username: string, password: string): Promise<UserAuthProps>;
  refreshToken(token: TokenPayload): Promise<UserAuthProps>;
  forgotPassword(email: string): Promise<void | WrapperServerErrorResponse>;
  resetPassword({ user_id, user_mail, confirmation_token, password, password2 }: ResetPasswordProps): Promise<void | WrapperServerErrorResponse>;
  logout(): void;
}

export type { IUserAuthRepo };
