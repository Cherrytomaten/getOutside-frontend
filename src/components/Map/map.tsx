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

export const icon = new Icon({
  iconUrl: '/pin.png',
  iconSize: [70, 70],
});

// render the marker inside the filter and delete the wholelayer

function Map() {
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
