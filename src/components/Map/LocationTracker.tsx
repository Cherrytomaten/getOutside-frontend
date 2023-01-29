import { Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLngExpression, LatLngTuple, LocationEvent } from "leaflet";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { InfoPopup } from '@/components/InfoPopup';

export const locationIcon = new Icon({
  iconUrl: '/locationPin.png',
  iconSize: [27, 27],
});

type LocationTrackerProps = {
  setUserLocation: Dispatch<SetStateAction<LatLngExpression>>;
  locationPref: boolean | null;
  setLocationPref: Dispatch<SetStateAction<boolean | null>>;
};

function LocationTracker({ setUserLocation, setLocationPref, locationPref }: LocationTrackerProps) {
  const [userPos, setUserPos] = useState<LatLngTuple | undefined>(undefined);
  const trackingWatcherStarted = useRef(false);
  const initialTrack = useRef(true);

  const map = useMapEvents({
    locationfound(e: LocationEvent) {
      if (userPos !== undefined) {
        const latDist = e.latlng.lat - Number(userPos[0]);
        const longDist = e.latlng.lng - Number(userPos[1]);

        // only set new pos if new point has enough distance to old location
        if ((latDist < 0.00005 && latDist > -0.00005) && (longDist < 0.00005 && longDist > -0.00005)) {
          return;
        }
      }

      setUserPos([e.latlng.lat, e.latlng.lng]);

      if (initialTrack) {
        map.flyTo(e.latlng, map.getZoom());
        setLocationPref(true);
        initialTrack.current = false;
      }

      setUserLocation([e.latlng.lat, e.latlng.lng]);
    },
    locationerror() {
      setLocationPref(false);
    },
  });

  function trackingWatcher() {
    map.locate();
  }

  useEffect(() => {
    if (!trackingWatcherStarted.current) {
      // init call
      trackingWatcher();
      trackingWatcherStarted.current = true;
      // start interval
      setInterval(trackingWatcher, 20000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (locationPref !== null && !locationPref) {
    return <InfoPopup text="GetOutside could't locate your position." exp={3000} />;
  }

  if (userPos !== undefined) {
    return <Marker position={userPos} icon={locationIcon}></Marker>;
  } else {
    return null;
  }
}

export { LocationTracker };
