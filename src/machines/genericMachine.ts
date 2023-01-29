import { createMachine, assign } from 'xstate';
import { GenericStateMachineContext, GenericStateMachineEvent, GenericStateMachineTypestate } from '@/types/GenericStateMachineProps';

const createGenericStateMachine = <T, W>() =>
  createMachine<GenericStateMachineContext<T, W>, GenericStateMachineEvent<T, W>, GenericStateMachineTypestate<T, W>>(
    {
      id: 'genericStateMachine',
      initial: 'idle',
      predictableActionArguments: true,
      context: {
        data: null,
        err: null,
      },
      states: {
        idle: {
          on: {
            RUN_REQUEST: 'pending',
          },
        },
        pending: {
          entry: ['pendingFunction'],
          on: {
            RESOLVE: { target: 'success', actions: ['setData'] },
            REJECT: { target: 'failure', actions: ['setErrorMessage'] },
          },
        },
        success: { type: 'final' },
        failure: {
          on: {
            RUN_REQUEST: 'pending',
          },
        },
      },
    },
    {
      actions: {
        setData: assign((_ctx, event: any) => ({
          data: event.data,
          err: null,
        })),

        setErrorMessage: assign((_ctx, event: any) => ({
          err: event.err,
        })),
      },
    }
  );

export { createGenericStateMachine };
