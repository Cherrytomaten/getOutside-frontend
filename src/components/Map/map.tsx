import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import pins from '@/simulation/pins.json';
import Link from 'next/link';
import { DropdownMenu } from '@/components/Filter/Dropdown';
import { PinProps } from '@/types/Pins';
import { ActivityType } from '@/types/Pins/ActivityType';
import { useState } from "react";

const position: LatLngExpression = [52.520008, 13.404954];

// creates a list with all existing activity values
const activityOptions: string[] = [...new Set(pins.mappoint.map((activity) => activity.properties.TYPE))];

export const icon = new Icon({
    iconUrl: '/pin.png',
    iconSize: [25, 35],
});

function Map() {
    const [locationFilter, setFilter] = useState<ActivityType[]>([]);

    return (
        <div>
            <DropdownMenu checkboxList={activityOptions} locationFilter={locationFilter} setLocFilter={setFilter} />
            <MapContainer
                className="w-screen h-[80vh] mx-auto mt-5"
                center={position}
                zoom={12}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <div>
                    <div>
                        {pins.mappoint.map((pinElemData: PinProps) => {
                            if (locationFilter.length === 0)
                                return (
                                    <div>
                                        {pins.mappoint.map((pinElemData) => (
                                            <Marker
                                                key={pinElemData.properties.PARK_ID}
                                                position={[
                                                    pinElemData.geometry.coordinates[0],
                                                    pinElemData.geometry.coordinates[1],
                                                ]}
                                                icon={icon}
                                            >
                                                <Popup>
                                                    <div className="font-bold text-white-100">
                                                        <p className="font-extrabold ">
                                                            {pinElemData.properties.NAME}
                                                        </p>
                                                        <p>Address: {pinElemData.properties.ADDRESS}</p>
                                                        <Link href={`/mappoint/${pinElemData.properties.PARK_ID}`}>
                                                            Activity page
                                                        </Link>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}
                                    </div>
                                );

                            return (
                                locationFilter.includes(pinElemData.properties.TYPE) && (
                                    <div>
                                        <Marker
                                            key={pinElemData.properties.PARK_ID}
                                            position={[
                                                pinElemData.geometry.coordinates[0],
                                                pinElemData.geometry.coordinates[1],
                                            ]}
                                            icon={icon}
                                        >
                                            <Popup>
                                                <div className="font-bold text-white-100">
                                                    <p className="font-extrabold ">
                                                        {pinElemData.properties.NAME}
                                                    </p>
                                                    <p>Address: {pinElemData.properties.ADDRESS}</p>
                                                    <Link href={`/mappoint/${pinElemData.properties.PARK_ID}`}>
                                                        Activity page
                                                    </Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            </MapContainer>
        </div>
    );
}

export default Map;
