import { createMachine, assign } from 'xstate';
import { PinQueryContext, PinQueryEvent, PinQueryTypestate } from "@/types/Pins/MapPinQueryMachine";

const fetchPinsMachine = createMachine<PinQueryContext, PinQueryEvent, PinQueryTypestate>({
    id: 'fetch',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
        pins: [],
        err: null
    },
    states: {
        idle: {
            on: {
                FETCH_PINS: 'pending'
            }
        },
        pending: {
            entry: ['fetchPins'],
            on: {
                RESOLVE: { target: 'success', actions: ['setPinData'] },
                REJECT: { target: 'failure', actions: ['setErrorMessage'] }
            }
        },
        success: {
            on: {
                FETCH_PINS: 'pending'
            }
        },
        failure: {
            on: {
                FETCH_PINS: 'pending',
            }
        },
        queue: {
            entry: 'logEntry'
        }
    }
}, {
    actions: {
        setPinData: assign((_ctx, event: any) => ({
            pins: event.pins,
            err: null
        })),

        setErrorMessage: assign((_ctx, event: any) => ({
            err: event.err,
        })),

        logEntry: () => {
            console.log("entered");
        }
    }
});

export { fetchPinsMachine };
