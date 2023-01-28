import { TokenPayload } from '@/types/Auth/TokenPayloadProps';

type UserAuthProps = {
  userId: string;
  access: TokenPayload;
  refresh: TokenPayload;
};

export type { UserAuthProps };
