import { Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { InfoPopup } from "@/components/InfoPopup";

export const locationIcon = new Icon({
    iconUrl: '/locationPin.png',
    iconSize: [30, 30],
});

type Coords = {
    lat: number | undefined;
    long: number | undefined;
}

function LocationTracker() {
    const [userPos, setUserPos] = useState<Coords>({ lat: undefined, long: undefined });
    const [geoError, setGeoError] = useState<boolean>(false);

    const map = useMapEvents({
        locationfound(e) {
            setUserPos({ lat: e.latlng.lat, long: e.latlng.lng });
            map.flyTo(e.latlng, map.getZoom());
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

    if (userPos.long && userPos.lat) {
        return (<Marker position={[userPos.lat, userPos.long]} icon={locationIcon}></Marker>);
    } else {
        return null;
    }

}

export { LocationTracker };
