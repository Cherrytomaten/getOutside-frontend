import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import style from '../../styles/Home.module.css';
import { Icon } from 'leaflet';
import * as pinsData from '../../data/pins.json';
import Filters from '../Filter/Filters';

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

const position = [52.520008, 13.404954];

const aActivities = [
  ...new Set(pinsData.features.map((activity) => activity.properties.TYPE)),
];

export const icon = new Icon({
  iconUrl: '/pin.png',
  iconSize: [70, 70],
});

// render the marker inside the filter and delete the wholelayer

function Map() {
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

  return (
    <div>
      <ul>
        <div>{aActivities.map(checkboxFilter)}</div>
      </ul>
      {/* <Filters /> */}
      <MapContainer
        className={style.map}
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
            {/* {pinsData.features.map((data: PinProps) => {  // what about the pin type???*/}
            {pinsData.features.map((data) => {
              if (locationFilter.length === 0)
                return (
                  <div>
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
                  </div>
                );
              return (
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
                )
              );
              // if locationFilter.includes(data.properties.TYPE); return <Marker>
            })}
          </div>
        </div>
        {/* <Filters /> */}
        {/* {pinsData.features.map((pin) => (
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
        ))} */}
      </MapContainer>
    </div>
  );
}

export default Map;
