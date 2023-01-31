import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { FilterMenu } from '@/components/Map/FilterMenu';
import { PinProps } from '@/types/Pins';
import { ActivityType } from '@/types/Pins/ActivityType';
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { RadiusMenu } from '@/components/Map/RadiusMenu';
import { Filter } from '@/resources/svg/Filter';
import { MapPopup } from '@/components/Map/MapPopup';
import { LocationTracker } from '@/components/Map/LocationTracker';
import { ContentPopup } from '@/components/ContentPopup';
import { DEFAULT_POSITION } from '@/types/constants';
import { useManageMapData } from '@/hooks/useManageMapData';
import { ActivityIcon } from '@/resources/leafletIcons/ActivityIcon';
import { SmallSpinner } from '@/components/SmallSpinner';
import { Radius } from '@/resources/svg/Radius';
import { FavoritePinsList } from "@/types/Pins/FavoritePinsList";

type MapProps = {
  cookiedCategories: string[] | undefined;
  cookiedRadius: number | undefined;
  cookiedShowOnlyFav: boolean | undefined;
  favoritePinsList: FavoritePinsList
};

function Map({ cookiedCategories, cookiedRadius, cookiedShowOnlyFav, favoritePinsList }: MapProps) {
  console.log(cookiedShowOnlyFav);
  const [showCatFilter, setShowCatFilter] = useState<boolean>(false);
  const [showRadiusFilter, setShowRadiusFilter] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<ActivityType[] | undefined>(cookiedCategories);
  const [radius, setRadius] = useState<number | undefined>(cookiedRadius);
  const [locationPreference, setLocationPreference] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngExpression>(DEFAULT_POSITION);
  const [onlyShowFavs, setOnlyShowFavs] = useState<boolean | undefined>(cookiedShowOnlyFav);
  const { fetchPinDataQueryState } = useManageMapData({
    radius: radius,
    location: userLocation,
    categoryFilter: categoryFilter,
    setCatFilter: setCategoryFilter,
    allCats: allCategories,
    setAllCats: setAllCategories,
    locationPreference: locationPreference,
    showOnlyFav: onlyShowFavs
  });

  // update fav filter
  useEffect(() => {
    setOnlyShowFavs(cookiedShowOnlyFav)
  }, [cookiedShowOnlyFav]);

  // update radius filter
  useEffect(() => {
    setRadius(cookiedRadius)
  }, [cookiedRadius]);

  // update category filter
  useEffect(() => {
    setCategoryFilter(cookiedCategories)
  }, [cookiedCategories]);


  function isPinFavorite(pinId: string): boolean {
    return favoritePinsList.some(favElem => favElem.pin.uuid === pinId);
  }

  const mapElem = useMemo(
    () => (
      <MapContainer className="w-screen h-full" center={userLocation} zoom={13} minZoom={7} maxZoom={20} scrollWheelZoom={true} preferCanvas={true}>
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        <LocationTracker setUserLocation={setUserLocation} locationPref={locationPreference} setLocationPref={setLocationPreference} />
        <Circle center={userLocation} radius={radius ?? 0} pathOptions={{ color: '#3ED598', weight: 2, opacity: 0.8, fillColor: '#82e7bd', fillOpacity: 0.05 }} />

        <div>
          {fetchPinDataQueryState.context.pins.map((pinElemData: PinProps) => {
            if (pinElemData.category === null || (categoryFilter !== undefined && !categoryFilter.includes(pinElemData.category))) {
              return null;
            }

            // don't show pin if only favs should be shown and the current pin isn't one of them
            if (onlyShowFavs && !isPinFavorite(pinElemData.uuid)) {
              return null;
            }

            return (
              <div key={pinElemData.uuid + '-marker-id'}>
                <Marker alt="" position={[pinElemData.latitude, pinElemData.longitude]} icon={ActivityIcon}>
                  <MapPopup pin={pinElemData} />
                </Marker>
              </div>
            );
          })}
        </div>
      </MapContainer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryFilter, fetchPinDataQueryState.context.pins, locationPreference, radius, userLocation, onlyShowFavs]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ease: 'easeOut', duration: 0.6 }} className="relative w-full h-full">
      <AnimatePresence>{fetchPinDataQueryState.matches('pending') && <SmallSpinner />}</AnimatePresence>

      <div className="z-[999] absolute top-4 right-4 md:right-8">
        <div
          className="relative w-12 h-12 flex flex-col justify-center items-center px-3 bg-bright-seaweed rounded-full shadow-md transition-colors cursor-pointer xs:hover:bg-hovered-seaweed"
          role="button"
          aria-label="Category filter"
          title="Select categories"
          onClick={() => setShowCatFilter(true)}>
          <Filter width="100%" height="100%" fill="#fff"></Filter>
          <div className="z-10 absolute -right-2 -bottom-2 w-7 h-7 flex flex-col justify-center items-center bg-white rounded-full">
            <span className="text-xs">{categoryFilter?.length ?? 0}</span>
          </div>
        </div>

        <div
          className="w-12 h-12 flex flex-col justify-center items-center px-3 mt-3 bg-bright-seaweed rounded-full shadow-md transition-colors cursor-pointer xs:hover:bg-hovered-seaweed"
          role="button"
          aria-label="Filter filter"
          title="Select radius"
          onClick={() => setShowRadiusFilter(true)}>
          <Radius width="100%" height="100%" fill="#fff"></Radius>
        </div>
      </div>

      <ContentPopup trigger={showCatFilter} setTrigger={setShowCatFilter}>
        <FilterMenu allCategories={allCategories} categoryFilter={categoryFilter} setCatFilter={setCategoryFilter} setTrigger={setShowCatFilter} onlyShowFavs={onlyShowFavs} setOnlyShowFavs={setOnlyShowFavs} />
      </ContentPopup>

      <ContentPopup trigger={showRadiusFilter} setTrigger={setShowRadiusFilter}>
        <RadiusMenu radius={radius} updateRadius={setRadius} mapDataFetchState={fetchPinDataQueryState} toggleMenu={setShowRadiusFilter} />
      </ContentPopup>

      {mapElem}
    </motion.div>
  );
}

export default Map;
