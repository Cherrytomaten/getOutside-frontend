import { LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useMachine } from "@xstate/react";
import { fetchPinsMachine } from "@/machines/mapPinQuery";
import { PinRepo } from "@/repos/PinRepo";
import { PinProps } from "@/types/Pins";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { setCookie } from "@/util/cookieManager";
import { ACTIVE_CATEGORIES, RADIUS_FILTER } from "@/types/constants";
import { ActivityType } from "@/types/Pins/ActivityType";

type useManageMapDataProps = {
    radius: number;
    location: LatLngExpression;
    categoryFilter: ActivityType[];
    locationPreference: boolean | null;
    setAllCats: Dispatch<SetStateAction<string[]>>;
}

function useManageMapData({ radius, location, categoryFilter, setAllCats, locationPreference }: useManageMapDataProps) {
    const [fetchPinDataQueryState, sendToPinQueryMachine] = useMachine(
        fetchPinsMachine,
        {
            actions: {
                fetchPins: (ctx, event: { type: 'FETCH_PINS'; payload: { location: LatLngExpression, radius: number };
                }) => {
                    PinRepo.getByRadius(event.payload.location, event.payload.radius).then(
                        (res: PinProps[]) => {
                            console.log(`Queried ${res.length} Pins.`);
                            sendToPinQueryMachine({
                                type: 'RESOLVE',
                                pins: res,
                                err: null
                            });
                        },
                        (err: FetchServerErrorResponse) => {
                            let message: string;
                            if (err?.errors?.message === undefined) {
                                message = "API fetch error";
                            } else {
                                message = err.errors.message;
                            }

                            console.log('Failed to query pins:', message);
                            sendToPinQueryMachine({
                                type: 'REJECT',
                                err: message,
                            });
                        }
                    )
                }
            }
        }
    )

    useEffect(() => {
        // trigger inital & future data requests only after user set a preference on the geolocation tracking
        if (locationPreference !== null) {
            sendToPinQueryMachine({
                type: 'FETCH_PINS',
                payload: { location: location, radius: radius }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [radius, location, locationPreference]);

    // update radius cookie
    useEffect(() => {
        setCookie({name: RADIUS_FILTER, value: {"radius": radius}, exp: 14400000});
    }, [radius]);

    // update category list cookie
    useEffect(() => {
        setCookie({ name: ACTIVE_CATEGORIES, value: { "activeCats": categoryFilter.toString() }, exp: 14400000});
    }, [categoryFilter]);

    // update all possible Cats for the cat filter
    useEffect(() => {
        setAllCats([...new Set(fetchPinDataQueryState.context.pins.map((activity) => activity.properties.TYPE.toLowerCase()))]);
    }, [fetchPinDataQueryState.context.pins, setAllCats]);

    return { fetchPinDataQueryState, sendToPinQueryMachine };
}

export { useManageMapData };
