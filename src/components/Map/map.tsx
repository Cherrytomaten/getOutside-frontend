import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import style from '../../styles/Home.module.css';
// import * as parkData from '../data/pins.json';
import { Icon } from 'leaflet';
// import { Link } from 'theme-ui';
import Link from 'next/link';

const position = [52.520008, 13.404954];
const position2 = [52.480894, 13.355937];
const position3 = [52.494056, 13.442307];
export const icon = new Icon({
  iconUrl: '/pin.png',
  iconSize: [70, 70],
});

// function pinClicked() {
//   console.log('click');
// }

// function pinCosed() {
//   console.log('close');
// }

function Map() {
  return (
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
      <Marker position={position} icon={icon}>
        <Popup>
          Skatepark bla bla bla. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={position2} icon={icon}>
        <Popup>
          Basketball blo blo bla. <br /> Easily customizable.
          <Link href="/maps/baskteball">Baskteball at 6</Link>
        </Popup>
      </Marker>
      <Marker position={position3} icon={icon}>
        <Popup>
          Spa bli bli blo. <br /> nix
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
