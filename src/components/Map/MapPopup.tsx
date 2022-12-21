import Link from "next/link";
import { Popup } from "react-leaflet";
import { PinProps } from "@/types/Pins";

type MapPopupProps = {
    pin: PinProps
}

function MapPopup({ ...props }: MapPopupProps) {
    return (
        <Popup>
            <div id="map-popup-container">
                <h3 className="font-bold text-default-font text-md">
                    {props.pin.properties.NAME}
                </h3>
                <h4 className="mt-1 text-bright-seaweed">{props.pin.properties.TYPE}</h4>
                <p className="font-light text-default-font"><span className="font-normal text-bright-seaweed">Address:</span> {props.pin.properties.ADDRESS}</p>
                <Link href={`/mappoint/${props.pin.properties.PARK_ID}`}>
                    <a className="w-full block px-3 py-1 text-center text-white bg-bright-seaweed rounded-full xs:hover:bg-hovered-seaweed">Visit</a>
                </Link>
            </div>
        </Popup>
    );
}

export { MapPopup };
