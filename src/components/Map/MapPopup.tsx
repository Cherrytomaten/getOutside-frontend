import Link from "next/link";
import { Popup } from "react-leaflet";
import { PinProps } from "@/types/Pins";

type MapPopupProps = {
    pin: PinProps
}

function MapPopup({ ...props }: MapPopupProps) {
    function getDeviceMapProvider(): string {
        if (navigator.platform === "MacIntel" || navigator.platform === "iPhone" || navigator.platform === "iPad" || navigator.platform === "iPod") {
            return "https://maps.apple.com/?q=";
        } else {
            return "https://www.google.com/maps?q="
        }
    }

    const url: string = getDeviceMapProvider() + props.pin.geometry.coordinates[0] + "," + props.pin.geometry.coordinates[1];

    return (
        <Popup>
            <div id="map-popup-container">
                <h3 className="font-bold text-default-font text-md">
                    {props.pin.properties.NAME}
                </h3>
                <h4 className="mt-1 text-bright-seaweed">{props.pin.properties.TYPE}</h4>
                <p className="font-light text-default-font"><span className="font-normal text-bright-seaweed">Address:</span> {props.pin.properties.ADDRESS}</p>
                <Link href={`/mappoint/${props.pin.properties.PARK_ID}`}>
                    <a className="w-full block px-3 py-1 text-center bg-bright-seaweed rounded-full transition-colors xs:hover:bg-hovered-seaweed">Visit</a>
                </Link>
                <a
                    className="relative w-full block px-3 py-1 mt-4 text-center !text-white border rounded-full border-gray-300 transition-colors xs:hover:bg-gray-600"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                >
                    {url.includes('apple')
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src="assets/apple-maps-icon.png" alt="Apple Maps" className="absolute top-0 right-4 h-full py-1" />
                        // eslint-disable-next-line @next/next/no-img-element
                        : <img src="assets/google-maps-icon.png" alt="Google Maps" className="absolute top-0 right-4 h-full py-1" />
                    }

                    <p className="!m-0">Route</p>
                </a>
            </div>
        </Popup>
    );
}

export { MapPopup };
