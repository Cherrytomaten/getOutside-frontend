import { createMachine, assign } from 'xstate';
import { AuthContext, AuthEvent, AuthTypestate } from "@/types/Auth";

const fetchAuthUserMachine = createMachine<AuthContext, AuthEvent, AuthTypestate>({
    id: 'fetchUser',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
        user: null,
        retries: 0,
        err: null
    },
    states: {
        idle: {
            on: {
                FETCH_AUTH_USER: 'pending'
            }
        },
        pending: {
            entry: ['fetchUserAuth'],
            on: {
                RESOLVE_AUTH: { target: 'success', actions: ['setUserAuthData'] },
                REJECT_AUTH: { target: 'failure', actions: ['setErrorMessage'] }
            }
        },
        success: {
            on: {
                FETCH_AUTH_USER: 'pending'
            }
        },
        refresh: {
            on: {
                RESOLVE_AUTH: 'success',
                REJECT_AUTH: 'failure'
            }
        },
        failure: {
            on: {
                RETRY: 'refresh',
                FETCH_AUTH_USER: 'pending'
            }
        }
    },
}, {
    // retry counter probably not necessary
    actions: {
        setUserAuthData: assign((ctx, event: any) => ({
            user: event.user,
            err: null
        })),

        setErrorMessage: assign((ctx, event: any) => ({
            err: event.err
        })),

        setRetriesCounter: assign((ctx, event: any) => ({
            retries: ctx.retries + 1
        }))
    },
});

export { fetchAuthUserMachine };
