import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { FilterMenu } from '@/components/Map/FilterMenu';
import { PinProps } from '@/types/Pins';
import { ActivityType } from '@/types/Pins/ActivityType';
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RadiusMenu } from "@/components/Map/RadiusMenu";
import { Filter } from "@/resources/svg/Filter";
import { MapPopup } from "@/components/Map/MapPopup";
import { LocationTracker } from "@/components/Map/LocationTracker";
import { ContentPopup } from "@/components/ContentPopup";
import { Radius } from "@/resources/svg/Radius";
import { DEFAULT_POSITION } from "@/types/constants";
import { useManageMapData } from "@/hooks/useManageMapData";
import { ActivityIcon } from "@/resources/leafletIcons/ActivityIcon";
import { SmallSpinner } from "@/components/SmallSpinner";

type MapProps = {
    cookiedCategories: string[];
    cookiedRadius: number;
}

function Map({ cookiedCategories, cookiedRadius }: MapProps) {
    const [showCatFilter, setShowCatFilter] = useState<boolean>(false);
    const [showRadiusFilter, setShowRadiusFilter] = useState<boolean>(false);

    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<ActivityType[]>(cookiedCategories);
    const [radius, setRadius] = useState<number>(cookiedRadius);
    const [locationPreference, setLocationPreference] = useState<boolean | null>(null);
    const [userLocation, setUserLocation] = useState<LatLngExpression>(DEFAULT_POSITION);
    const { fetchPinDataQueryState } = useManageMapData({ radius: radius, location: userLocation, categoryFilter: categoryFilter, setAllCats: setAllCategories, locationPreference: locationPreference });

    const mapElem = useMemo(() => (
        <MapContainer
            className="w-screen h-screen"
            center={userLocation}
            zoom={13}
            minZoom={7}
            maxZoom={20}
            scrollWheelZoom={true}
            preferCanvas={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
            />

            <LocationTracker setUserLocation={setUserLocation} locationPref={locationPreference} setLocationPref={setLocationPreference} />
            <Circle center={userLocation} radius={radius} pathOptions={{ color: '#3ED598', weight: 2, opacity: 0.8, fillColor: '#82e7bd', fillOpacity: 0.05 }} />

            <div>
                {fetchPinDataQueryState.context.pins.map((pinElemData: PinProps) => {
                    if (!categoryFilter.includes(pinElemData.properties.TYPE)) {
                        return null;
                    }
                    return (
                        <div key={pinElemData.properties.PARK_ID + "-marker-id"}>
                            <Marker
                                alt=""
                                position={[
                                    pinElemData.geometry.coordinates[0],
                                    pinElemData.geometry.coordinates[1],
                                ]}
                                icon={ActivityIcon}>
                                <MapPopup pin={pinElemData} />
                            </Marker>
                        </div>
                    );
                })}
            </div>
        </MapContainer>
), [categoryFilter, fetchPinDataQueryState.context.pins, locationPreference, radius, userLocation]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: 'easeOut', duration: .6 }}
            className="relative w-full h-full"
        >

            <AnimatePresence>
                {fetchPinDataQueryState.matches('pending') &&
                    <SmallSpinner />
                }
            </AnimatePresence>

            <div className="z-[999] absolute top-4 right-4 md:right-8">
                <div
                    className="w-14 h-14 flex flex-col justify-center items-center px-3 bg-bright-seaweed rounded-full shadow-md transition-colors cursor-pointer xs:hover:bg-hovered-seaweed"
                    role="button"
                    aria-label="Category filter"
                    onClick={() => setShowCatFilter(true)}
                >
                    <Filter width="100%" height="auto" fill="#fff"></Filter>
                </div>

                <div
                    className="relative w-14 h-14 flex flex-col justify-center items-center px-3 mt-3 bg-bright-seaweed rounded-full shadow-md transition-colors cursor-pointer xs:hover:bg-hovered-seaweed"
                    role="button"
                    aria-label="Radius filter"
                    onClick={() => setShowRadiusFilter(true)}
                >
                    <Radius width="100%" height="auto" fill="#fff"></Radius>
                    <div className="z-10 absolute -right-2 -bottom-2 w-7 h-7 flex flex-col justify-center items-center bg-white rounded-full"><span className="text-xs">{radius/1000}</span></div>
                </div>
            </div>

            <ContentPopup trigger={showCatFilter} setTrigger={setShowCatFilter}>
                <FilterMenu allCategories={allCategories} categoryFilter={categoryFilter} setCatFilter={setCategoryFilter} />
            </ContentPopup>

            <ContentPopup trigger={showRadiusFilter} setTrigger={setShowRadiusFilter}>
                <RadiusMenu radius={radius} updateRadius={setRadius} mapDataFetchState={fetchPinDataQueryState} />
            </ContentPopup>

            {mapElem}
        </motion.div>
    );
}

export default Map;
