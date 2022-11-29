import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import pins from '@/data/pins.json';

type PinProps = {
  type: string;
  properties: {
    PARK_ID: number;
    FACILITYID: number;
    NAME: string;
    TYPE: string;
    ADDRESS: string;
    OPEN: null;
    NOTES: string;
    DESCRIPTION: string;
    PICTURE: null;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
};

type ActivityType =
  | 'basketball'
  | 'skatePark'
  | 'volleyball'
  | 'spa'
  | 'parkour'
  | 'handball'
  | 'tennis'
  | 'speedball'
  | string;

const position: LatLngExpression = [52.520008, 13.404954];

const aActivities = [
  ...new Set(pins.mappoint.map((activity) => activity.properties.TYPE)),
];

export const icon = new Icon({
  iconUrl: '/pin.png',
  iconSize: [70, 70],
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
      {activity}
    </div>
  );

  return (
    <div>
      {/* <Dropdown /> */}
      {aActivities.map(checkboxFilter)}
      <MapContainer
        className="w-screen h-[95vh] mx-auto mt-12"
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
                    {pins.mappoint.map((pin) => (
                      <Marker
                        key={pin.properties.PARK_ID}
                        position={[
                          pin.geometry.coordinates[0],
                          pin.geometry.coordinates[1],
                        ]}
                        icon={icon}
                      >
                        <Popup>
                          <div>
                            <h1>{pin.properties.NAME}</h1>
                            <p>{pin.properties.DESCRIPTION}</p>
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
                        <div>
                          <h1>{data.properties.NAME}</h1>
                          <p>{data.properties.DESCRIPTION}</p>
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
