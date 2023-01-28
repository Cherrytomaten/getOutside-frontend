import { BaseActionObject, ResolveTypegenMeta, ServiceMap, State, TypegenDisabled } from 'xstate';
import { LatLngExpression } from 'leaflet';
import { PinProps } from '@/types/Pins/index';

type PinQueryContext = {
  pins: PinProps[] | [];
  err: string | null;
};

type PinQueryEvent =
  | {
      type: 'FETCH_PINS';
      payload: { location: LatLngExpression; radius: number };
    }
  | {
      type: 'RESOLVE';
      pins: PinProps[];
      err: null;
    }
  | {
      type: 'REJECT';
      err: string;
    };

type PinQueryTypestate =
  | {
      value: 'idle';
      context: PinQueryContext & {
        pins: [];
        err: null;
      };
    }
  | {
      value: 'pending';
      context: PinQueryContext & {
        pins: [];
        err: null;
      };
    }
  | {
      value: 'success';
      context: PinQueryContext & {
        pins: [];
        err: null;
      };
    }
  | {
      value: 'failure';
      context: PinQueryContext & {
        err: string;
      };
    };

type PinQueryStateMachine = State<PinQueryContext, PinQueryEvent, any, PinQueryTypestate, ResolveTypegenMeta<TypegenDisabled, PinQueryEvent, BaseActionObject, ServiceMap>>;

export type { PinQueryContext, PinQueryEvent, PinQueryTypestate, PinQueryStateMachine };
