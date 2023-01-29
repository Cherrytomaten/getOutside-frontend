import { createMachine, assign } from 'xstate';
import { AuthContext, AuthEvent, AuthTypestate } from '@/types/Auth';

const fetchAuthUserMachine = createMachine<AuthContext, AuthEvent, AuthTypestate>(
  {
    id: 'fetchUser',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
      user: null,
      err: null,
      refreshAttempted: false,
    },
    states: {
      idle: {
        on: {
          FETCH_AUTH_USER: 'pending',
        },
      },
      pending: {
        entry: ['fetchUserAuth'],
        on: {
          RESOLVE_AUTH: { target: 'success', actions: ['setUserAuthData'] },
          REJECT_AUTH: { target: 'failure', actions: ['setErrorMessage'] },
        },
      },
      success: {
        entry: ['resetRefreshAttempt'],
        on: {
          FETCH_AUTH_USER: 'pending',
          RETRY: 'refresh',
          LOGOUT: 'reset',
        },
      },
      refresh: {
        entry: ['refreshToken'],
        on: {
          RESOLVE_AUTH: { target: 'success', actions: ['setUserAuthData'] },
          REJECT_AUTH: { target: 'failure', actions: ['setErrorMessage'] },
        },
      },
      failure: {
        on: {
          RETRY: 'refresh',
          FETCH_AUTH_USER: 'pending',
          LOGOUT: 'reset',
        },
      },
      reset: {
        entry: ['deleteCookies', 'resetMachine'],
        on: {
          IDLE: 'idle',
        },
      },
    },
  },
  {
    // retry counter probably not necessary
    actions: {
      setUserAuthData: assign((_ctx, event: any) => ({
        user: event.user,
        err: null,
      })),

      setErrorMessage: assign((_ctx, event: any) => ({
        err: event.err,
        refreshAttempted: event.attRef,
      })),

      resetRefreshAttempt: assign((_ctx, _event: any) => ({
        refreshAttempted: false,
      })),

      resetMachine: assign((_ctx, _event: any) => ({
        user: null,
        err: null,
        refreshAttempted: false,
      })),
    },
  }
);

export { fetchAuthUserMachine };
