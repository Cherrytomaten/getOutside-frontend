import * as React from 'react';
import * as pinsData from '../../data/pins.json';
import { Marker, Popup, MapContainer } from 'react-leaflet';
import { Icon } from 'leaflet';
type PinProps = {
  type: string;
  properties: {
    PARK_ID: 0;
    FACILITYID: 0;
    NAME: string;
    TYPE: ActivityType;
    ADDRESS: string;
    OPEN: null;
    NOTES: string;
    DESCRIPTION: string;
    PICTURE: null;
  };
  geometry: {
    type: string;
    coordinates: [];
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

export const icon = new Icon({
  iconUrl: '/pin.png',
  iconSize: [70, 70],
});

const aActivities = [
  ...new Set(pinsData.features.map((activity) => activity.properties.TYPE)),
];

export default function Filters() {
  const [locationFilter, setFilter] = React.useState<ActivityType[]>([]);
  // const [pinFilter, setFilter] = React.useState<ActivityType[]>([]);
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
  // how can i return pin with the matching type ????
  return (
    <div>
      <div>
        <ul>
          <div>{aActivities.map(checkboxFilter)}</div>
        </ul>
        <div>
          {/* {pinsData.features.map((data: PinProps) => {  // what about the pin type???*/}
          {pinsData.features.map((data) => {
            if (locationFilter.length === 0) return true;
            // return (
            locationFilter.includes(data.properties.TYPE) && (
              <div>
                {/* <MapContainer> */}
                {/* {pinsData.features.map((pin) => ( */}
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
                {/* ))} */}
                {/* </MapContainer> */}
              </div>
            );
            // );
            // if locationFilter.includes(data.properties.TYPE); return <Marker>
          })}
        </div>
      </div>

      {/* <div> */}
      {/* <MapContainer>
          {pinsData.features.map((pin) => (
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
        </MapContainer> */}
      {/* </div> */}
    </div>
  );
}
