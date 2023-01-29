import { RegisterUserProps } from '@/types/User/RegisterUserProps';
import { SimpleUserData } from '@/types/User/SimpleUserData';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';

type RegisterUserContext = {
  user: SimpleUserData | null;
  err: any | null;
};

type RegisterUserEvent =
  | {
      type: 'ATTEMPT_REGISTER';
      payload: RegisterUserProps;
    }
  | {
      type: 'RESOLVE_REGISTER';
      user: SimpleUserData;
      err: null;
    }
  | {
      type: 'REJECT_REGISTER';
      err: FetchServerErrorResponse;
    }
  | {
      type: 'RETRY_REGISTER';
      payload: RegisterUserProps;
    };

type RegisterUserTypestate =
  | {
      value: 'idle';
      context: RegisterUserContext & {
        user: null;
        err: null;
      };
    }
  | {
      value: 'pending';
      context: RegisterUserContext & {
        user: null;
        err: null;
      };
    }
  | {
      value: 'success';
      context: RegisterUserContext & {
        user: SimpleUserData;
        err: null;
      };
    }
  | {
      value: 'failure';
      context: RegisterUserContext & {
        user: null;
        err: any;
      };
    };

export type { RegisterUserContext, RegisterUserEvent, RegisterUserTypestate };
