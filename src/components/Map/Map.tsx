import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import pins from '@/simulation/pins.json';
import Link from 'next/link';
import { FilterMenu } from '@/components/Map/FilterMenu';
import { PinProps } from '@/types/Pins';
import { ActivityType } from '@/types/Pins/ActivityType';
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RadiusMenu } from "@/components/Map/RadiusMenu";
import { Filter } from "@/resources/svg/Filter";
import { useCategoryCookieManager } from "@/hooks/useCategoryCookieManager";

const position: LatLngExpression = [52.520008, 13.404954];

// creates a list with all existing activity values
const activityOptions: string[] = [...new Set(pins.mappoint.map((activity) => activity.properties.TYPE.toLowerCase()))];

export const icon = new Icon({
    iconUrl: '/pin.png',
    iconSize: [25, 35],
});

function Map() {
    const [categoryFilter, setCategoryFilter] = useState<ActivityType[]>([]);
    const [showCatFilter, setShowCatFilter] = useState<boolean>(false);
    const [showRadiusFilter, setShowRadiusFilter] = useState<boolean>(false);
    useCategoryCookieManager({ allCategories: activityOptions, categoryFilter: categoryFilter, setCatFilter: setCategoryFilter });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: 'easeOut', duration: .6 }}
            className="relative w-full h-full"
        >
            <div className="z-[999] absolute top-4 right-4 md:right-8">
                <div
                    className="w-14 h-14 flex flex-col justify-center items-center px-3 bg-bright-seaweed rounded-full shadow-md transition-colors cursor-pointer xs:hover:bg-hovered-seaweed"
                    role="button"
                    aria-label="Category filter"
                    onClick={() => setShowCatFilter(true)}
                >
                    <Filter width="100%" height="auto" fill="#fff"></Filter>
                </div>
            </div>
            <AnimatePresence>
                {showCatFilter &&
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeOut', duration: .2 }}
                        className="z-[1010] absolute top-0 left-0 w-full h-full">
                        <FilterMenu allCategories={activityOptions} categoryFilter={categoryFilter} setCatFilter={setCategoryFilter} showMenuFunc={setShowCatFilter} />
                    </motion.div>
                }
            </AnimatePresence>

            <RadiusMenu />

            <MapContainer
                className="w-screen h-screen"
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
                            return (
                                categoryFilter.includes(pinElemData.properties.TYPE) && (
                                    <div>
                                        <Marker
                                            key={pinElemData.properties.PARK_ID}
                                            position={[
                                                pinElemData.geometry.coordinates[0],
                                                pinElemData.geometry.coordinates[1],
                                            ]}
                                            icon={icon}>
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
        </motion.div>
    );
}

export default Map;
