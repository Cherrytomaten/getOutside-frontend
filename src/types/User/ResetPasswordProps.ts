import { ResetPasswordAuthProps } from '@/types/User/ResetPasswordAuthProps';

type ResetPasswordProps = ResetPasswordAuthProps & {
  password: string;
  password2: string;
};

export type { ResetPasswordProps };
