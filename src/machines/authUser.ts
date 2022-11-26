import { createMachine, assign } from 'xstate';
import { AuthContext, AuthEvent, AuthTypestate } from "@/types/Auth";

const fetchAuthUserMachine = createMachine<AuthContext, AuthEvent, AuthTypestate>({
    id: 'fetchUser',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
        user: null,
        err: null,
        refreshAttempted: false
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
                REJECT_AUTH: { target: 'failure', actions: ['setErrorMessage'] },
            }
        },
        success: {
            entry: ['resetRefreshAttempt'],
            on: {
                FETCH_AUTH_USER: 'pending'
            }
        },
        refresh: {
            entry: ['refreshToken'],
            on: {
                RESOLVE_AUTH: { target: 'success', actions: ['setUserAuthData'] },
                REJECT_AUTH: { target: 'failure', actions: ['setErrorMessage'] },
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
            err: event.err,
            refreshAttempted: event.attRef
        })),

        resetRefreshAttempt: assign((ctx, event: any) => ({
            refreshAttempted: false
        }))
    },
});

export { fetchAuthUserMachine };
