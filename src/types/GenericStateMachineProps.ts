import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { BaseActionObject, ResolveTypegenMeta, ServiceMap, State, TypegenDisabled } from "xstate";

type GenericStateMachineContext<T, W> = {
    data: T | null;
    err: any | null;
}

type GenericStateMachineEvent<T, W> =
    | { type: 'RUN_REQUEST'; payload: W }
    | { type: 'RESOLVE'; data: T, err: null }
    | { type: 'REJECT'; data: null, err: FetchServerErrorResponse | null }

type GenericStateMachineTypestate<T, W> =
    {
        value: 'idle';
        context: GenericStateMachineContext<T, W> & {
            data: null,
            err: null
        }
    }
    | {
        value: 'pending';
        context: GenericStateMachineContext<T, W> & {
            data: null,
            err: null
        }
    }
    | {
        value: 'success';
        context: GenericStateMachineContext<T, W> & {
            data: T,
            err: null
        }
    }
    | {
    value: 'failure';
    context: GenericStateMachineContext<T, W> & {
        data: null,
        err: any
    }
}

type GenericStateMachine<T, W> = State<GenericStateMachineContext<T, W>, GenericStateMachineEvent<T, W>, any, GenericStateMachineTypestate<T, W>, ResolveTypegenMeta<TypegenDisabled, GenericStateMachineEvent<T, W>, BaseActionObject, ServiceMap>>

export type { GenericStateMachineContext, GenericStateMachineEvent, GenericStateMachineTypestate, GenericStateMachine };
