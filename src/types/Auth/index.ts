import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { BaseActionObject, ResolveTypegenMeta, ServiceMap, State, TypegenDisabled } from "xstate";
import { UserAuthProps } from "@/types/User";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";

type AuthContext = {
    user: UserAuthProps | null,
    refreshAttempted: boolean,
    err: any | null
}

type AuthEvent =
  | {
      type: 'FETCH_AUTH_USER';
      payload: { username: string; password: string; byToken?: boolean };
    }
  | { type: 'RESOLVE_AUTH'; user: UserAuthProps; err: null }
  | {
      type: 'REJECT_AUTH';
      err: FetchServerErrorResponse | null;
      attRef: boolean;
    }
  | { type: 'RETRY'; payload: { refreshToken: TokenPayload } }
  | { type: 'LOGOUT' }
  | { type: 'IDLE' };

type AuthTypestate =
        {
            value: 'idle';
            context: AuthContext & {
                user: null,
                err: null
            };
        }
        | {
            value: 'pending';
            context: AuthContext & {
                user: null,
                err: null
            }
        }
        | {
            value: 'success';
            context: AuthContext & {
                user: UserAuthProps,
                err: null
            }
        }
        | {
            value: 'refresh';
            context: AuthContext;
        }
        | {
            value: 'failure';
            context: AuthContext & {
                user: null,
                err: any
            }
        }
        | {
            value: 'reset';
            context: AuthContext & {
                user: null,
                err: null,
                refreshAttempted: false
            }
}

type AuthStateMachine = State<AuthContext, AuthEvent, any, AuthTypestate, ResolveTypegenMeta<TypegenDisabled, AuthEvent, BaseActionObject, ServiceMap>>;



export type { AuthContext, AuthEvent, AuthTypestate, AuthStateMachine };
