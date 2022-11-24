import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type AuthContext = {
    user: UserProps | null,
    retries: number,
    err: any | null
}

type AuthEvent =
    {  type: 'FETCH_AUTH_USER'; payload: { email: string, password: string } }
    | { type: 'RESOLVE_AUTH'; user: UserProps, err: null }
    | { type: 'REJECT_AUTH'; err: FetchServerErrorResponse }
    | { type: 'RETRY', user: UserProps }

type AuthTypestate =
        {
            value: 'idle';
            context: AuthContext & {
                user: null,
                token: null,
                refreshToken: null,
                expiration: null,
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
                user: UserProps,
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


export type { AuthContext, AuthEvent, AuthTypestate };

