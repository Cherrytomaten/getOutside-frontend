import { LatLngExpression } from 'leaflet';
import { Dispatch, SetStateAction, useEffect } from "react";
import { useMachine } from '@xstate/react';
import { fetchPinsMachine } from '@/machines/mapPinQuery';
import { PinRepoClass } from '@/repos/PinRepo';
import { PinProps } from '@/types/Pins';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { setCookie } from "@/util/cookieManager";
import { ACTIVE_CATEGORIES, RADIUS_FILTER, SHOW_ONLY_FAV } from "@/types/constants";
import { ActivityType } from '@/types/Pins/ActivityType';
import { logger } from '@/util/logger';

type useManageMapDataProps = {
  radius: number | undefined;
  location: LatLngExpression;
  categoryFilter: ActivityType[] | undefined;
  setCatFilter: Dispatch<SetStateAction<string[] | undefined>>;
  locationPreference: boolean | null;
  allCats: string[];
  setAllCats: Dispatch<SetStateAction<string[]>>;
  showOnlyFav: boolean | undefined;
};

function useManageMapData({ radius, location, allCats, categoryFilter, setCatFilter, setAllCats, locationPreference, showOnlyFav }: useManageMapDataProps) {
  const [fetchPinDataQueryState, sendToPinQueryMachine] = useMachine(fetchPinsMachine, {
    actions: {
      fetchPins: (ctx, event: { type: 'FETCH_PINS'; payload: { location: LatLngExpression; radius: number } }) => {
        PinRepoClass.getByRadius(event.payload.location, event.payload.radius).then(
          (res: PinProps[]) => {
            logger.log(`Queried ${res.length} Pins.`);
            sendToPinQueryMachine({
              type: 'RESOLVE',
              pins: res,
              err: null,
            });
          },
          (err: FetchServerErrorResponse) => {
            let message: string;
            if (err?.errors?.message === undefined) {
              message = 'API fetch error';
            } else {
              message = err.errors.message;
            }

            logger.log('Failed to query pins:', message);
            sendToPinQueryMachine({
              type: 'REJECT',
              err: message,
            });
          }
        );
      },
    },
  });

  useEffect(() => {
    // trigger inital & future data requests only after user set a preference on the geolocation tracking
    // Also wait for cookies to be fetched first
    if (locationPreference !== null && radius !== undefined) {
      sendToPinQueryMachine({
        type: 'FETCH_PINS',
        payload: { location: location, radius: radius },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius, location, locationPreference]);



  // update radius cookie
  useEffect(() => {
    if (radius === undefined) {
      return;
    }
    setCookie({ name: RADIUS_FILTER, value: { radius: radius }, exp: 14400000 });
  }, [radius]);

  // update onlyFav cookie
  useEffect(() => {
    if (showOnlyFav === undefined) {
      return;
    }
    setCookie({ name: SHOW_ONLY_FAV, value: showOnlyFav, exp: 14400000 });
  }, [showOnlyFav]);

  // update category list cookie
  useEffect(() => {
    if (categoryFilter === undefined) {
      return;
    }
    setCookie({ name: ACTIVE_CATEGORIES, value: { activeCats: categoryFilter.toString() }, exp: 14400000 });
  }, [categoryFilter]);

  useEffect(() => {
    const oldAllCats: string[] = allCats;
    const newAllCats: string[] = [
      ...new Set(
        fetchPinDataQueryState.context.pins.map((activity) => {
          if (activity.category !== null) {
            return activity.category.toLowerCase();
          } else {
            return '';
          }
        })
      ),
    ];

    // remove all selection where the category doesn't exist in the current range anymore
    const updatedCatFilter = (categoryFilter ?? []).filter((cat) => newAllCats.includes(cat));

    // get all categories that are actually new and weren't present before
    const actuallyNewCats = newAllCats.filter((cat) => !oldAllCats.includes(cat));

    // update all possible Cats for the cat filter
    setAllCats([
      ...new Set(
        fetchPinDataQueryState.context.pins.map((activity) => {
          if (activity.category !== null) {
            return activity.category.toLowerCase();
          } else {
            return '';
          }
        })
      ),
    ]);

    // auto select newly acquired categories + unselect unpresent categories
    setCatFilter([...new Set([...updatedCatFilter, ...actuallyNewCats])]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPinDataQueryState.context.pins]);

  return { fetchPinDataQueryState, sendToPinQueryMachine };
}

export { useManageMapData };
