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
const position = [52.520008, 13.404954];
const position2 = [52.480894, 13.355937];
const position3 = [52.494056, 13.442307];
const position4 = [52.520057, 13.406163];
export const icon = new Icon({
  iconUrl: '/pin.png',
  iconSize: [70, 70],
});

function Map() {
  const [activePin, setActivePin] = React.useState(null);
  // const [activePin, setActivePin] =
  //   useState <
  //   PinProps >
  //   {
  //     type: '';
  //     properties: {
  //       PARK_ID: 0;
  //       FACILITYID: 0;
  //       NAME: '';
  //       TYPE: '';
  //       ADDRESS: '';
  //       OPEN: null;
  //       NOTES: '';
  //       DESCRIPTION: '';
  //       PICTURE: null;
  //     },
  //     geometry: {
  //       type: '';
  //       coordinates: [];
  //     },
  //   };
  return (
    <div>
      <Filters />
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
        {pinsData.features.map((pin) => (
          <Marker
            // onClick={() => {
            //   // which parks is set as active
            //   setActivePin(pin);
            //   console.log('click pin: ', pin);
            // }}
            // onClose={() => {
            //   setActivePin(null);
            //   console.log('null');
            // }}
            key={pin.properties.PARK_ID}
            position={[
              pin.geometry.coordinates[0],
              pin.geometry.coordinates[1],
            ]}
            icon={icon}
          >
            <Popup>
              <div>
                <h2>{pin.properties.NAME}</h2>
                <p>{pin.properties.DESCRIPTION}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {activePin && (
          <Popup position={[52.520008, 13.404954]}>
            <div>
              <h2>{activePin.properties.NAME}</h2>
              <p>{activePin.properties.DESCRIPTION}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
