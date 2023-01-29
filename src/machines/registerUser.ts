import { createMachine, assign } from 'xstate';
import { RegisterUserContext, RegisterUserEvent, RegisterUserTypestate } from '@/types/User/RegisterMachine';

const fetchRegisterMachine = createMachine<RegisterUserContext, RegisterUserEvent, RegisterUserTypestate>(
  {
    id: 'registerUser',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
      user: null,
      err: null,
    },
    states: {
      idle: {
        on: {
          ATTEMPT_REGISTER: 'pending',
        },
      },
      pending: {
        entry: ['registerUser'],
        on: {
          RESOLVE_REGISTER: { target: 'success', actions: ['setRegisterData'] },
          REJECT_REGISTER: { target: 'failure', actions: ['setErrorMessage'] },
        },
      },
      success: {
        type: 'final',
      },
      failure: {
        on: {
          RETRY_REGISTER: {
            target: 'pending',
          },
        },
      },
    },
  },
  {
    actions: {
      setRegisterData: assign((ctx, event: any) => ({
        user: event.user,
        err: null,
      })),

      setErrorMessage: assign((ctx, event: any) => ({
        user: null,
        err: event.err,
      })),
    },
  }
);

export { fetchRegisterMachine };
