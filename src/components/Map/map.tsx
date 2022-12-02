import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import pins from '@/simulation/pins.json';
import Link from 'next/link';
import MultipleSelectCheckmarks from '@/components/Filter/dropDown';
import { PinProps } from '@/types/pinProps';
import { ActivityType } from '@/types/ActivityType';

const position: LatLngExpression = [52.520008, 13.404954];

const aActivities = [
  ...new Set(pins.mappoint.map((activity) => activity.properties.TYPE)),
];

export const icon = new Icon({
  iconUrl: '/pin.png',
  iconSize: [25, 35],
});

function Map() {
  const [locationFilter, setFilter] = React.useState<ActivityType[]>([]);
  const checkboxFilter = (activity: ActivityType) => (
    <div>
      <input
        type="checkbox"
        name={activity}
        id=""
        checked={locationFilter.includes(activity)}
        onChange={(event) => {
          const isChecked = event.target.checked;
          setFilter((currentFilter) => {
            // if checked add activity to current activities
            if (isChecked) {
              return [...currentFilter, activity];
            }
            // if unchecked filter this activity out
            return currentFilter.filter(
              (filterActivity) => filterActivity !== activity
            );
          });
        }}
      />
      &nbsp;
      {/* how to style this component ?? */}
      {activity}
    </div>
  );

  return (
    <div>
      <div>{MultipleSelectCheckmarks(aActivities.map(checkboxFilter))}</div>
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
            {pins.mappoint.map((data: PinProps) => {
              if (locationFilter.length === 0)
                return (
                  <div>
                    {pins.mappoint.map((data) => (
                      <Marker
                        key={data.properties.PARK_ID}
                        position={[
                          data.geometry.coordinates[0],
                          data.geometry.coordinates[1],
                        ]}
                        icon={icon}
                      >
                        <Popup>
                          <div className="font-bold text-white-100">
                            <p className="font-extrabold ">
                              {data.properties.NAME}
                            </p>
                            <p>Address: {data.properties.ADDRESS}</p>
                            <Link href={`/mappoint/${data.properties.PARK_ID}`}>
                              Activity page
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </div>
                );
              return (
                locationFilter.includes(data.properties.TYPE) && (
                  <div>
                    <Marker
                      key={data.properties.PARK_ID}
                      position={[
                        data.geometry.coordinates[0],
                        data.geometry.coordinates[1],
                      ]}
                      icon={icon}
                    >
                      <Popup>
                        <div className="font-bold text-white-100">
                          <p className="font-extrabold ">
                            {data.properties.NAME}
                          </p>
                          <p>Address: {data.properties.ADDRESS}</p>
                          <Link href={`/mappoint/${data.properties.PARK_ID}`}>
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
