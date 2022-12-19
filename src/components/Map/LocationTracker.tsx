import { Marker, useMapEvents } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InfoPopup } from "@/components/InfoPopup";

export const locationIcon = new Icon({
    iconUrl: '/locationPin.png',
    iconSize: [27, 27],
});

type LocationTrackerProps = {
    setUserLocation: Dispatch<SetStateAction<LatLngExpression>>
    locationPref: boolean | null;
    setLocationPref:  Dispatch<SetStateAction<boolean | null>>;
}

function LocationTracker({ setUserLocation, setLocationPref, locationPref }: LocationTrackerProps) {
    const [userPos, setUserPos] = useState<LatLngExpression | undefined>(undefined);

    const map = useMapEvents({
        locationfound(e) {
            setUserPos([e.latlng.lat, e.latlng.lng]);
            map.flyTo(e.latlng, map.getZoom());
            setUserLocation([e.latlng.lat, e.latlng.lng]);
            setLocationPref(true);
        },
        locationerror() {
            setLocationPref(false);
        }
    });

    useEffect(() => {
        map.locate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (locationPref !== null && !locationPref) {
        return (<InfoPopup text="GetOutside could't locate your position." exp={3000} />);
    }

    if (userPos !== undefined) {
        return (<Marker position={userPos} icon={locationIcon}></Marker>);
    } else {
        return null;
    }

}

export { LocationTracker };
