import { Marker, useMapEvents } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InfoPopup } from "@/components/InfoPopup";

export const locationIcon = new Icon({
    iconUrl: '/locationPin.png',
    iconSize: [30, 30],
});

type LocationTrackerProps = {
    setUserLocation: Dispatch<SetStateAction<LatLngExpression>>
}

function LocationTracker({ setUserLocation }: LocationTrackerProps) {
    const [userPos, setUserPos] = useState<LatLngExpression | undefined>(undefined);
    const [geoError, setGeoError] = useState<boolean>(false);

    const map = useMapEvents({
        locationfound(e) {
            setUserPos([e.latlng.lat, e.latlng.lng]);
            map.flyTo(e.latlng, map.getZoom());
            setUserLocation([e.latlng.lat, e.latlng.lng]);
        },
        locationerror() {
            setGeoError(true);
        }
    });

    useEffect(() => {
        map.locate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (geoError) {
        return (<InfoPopup text="GetOutside could't locate your position." exp={3000} />);
    }

    if (userPos !== undefined) {
        return (<Marker position={userPos} icon={locationIcon}></Marker>);
    } else {
        return null;
    }

}

export { LocationTracker };
