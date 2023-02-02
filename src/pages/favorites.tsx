import { GetServerSidePropsContext } from "next";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import { logger } from "@/util/logger";
import { AUTH_TOKEN } from "@/types/constants";
import { PinProps } from "@/types/Pins";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EditButton } from "@/components/Favorites/EditButton";
import CloseSvg from "@/resources/svg/Close";
import { AnimatePresence, motion } from "framer-motion";
import { favRepoClass } from "@/repos/FavRepo";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getUserFavorites } from "@/services/userFavorites";
import { FavoritePinsList } from "@/types/Pins/FavoritePinsList";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type FavoritePageProps = {
  favorites: FavoritePinsList;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader('Cache-Control', 'no-store');
  const tokenData: string | undefined = context.req.cookies[AUTH_TOKEN];

  try {
    if (tokenData === undefined || tokenData === "undefined") {
      throw new Error("TokenData is undefined!");
    }

    const authToken: TokenPayload = JSON.parse(tokenData);

    return await getUserFavorites(authToken)
      .then((res: FavoritePinsList) => {
        return {
          props: {
            favorites: res,
          }
        }
      })
      .catch((_err: any) => {
        throw new Error("Internal Server Error.");
      })
  } catch (err: any) {
    logger.log("Error requesting profile page:", err);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

function Favorites(props: FavoritePageProps) {
  const [favs, setFavs] = useState<FavoritePinsList>(props.favorites);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initLoad, setInitLoad] = useState<boolean>(true);

  // refetch data on each page visit to be always have the latest data available
  useEffect(() => {
    favRepoClass.get()
      .then((res: FavoritePinsList) => {
        setFavs(res);
        setInitLoad(false);
      })
      .catch((err: FetchServerErrorResponse) => {
        logger.warn(err);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDelete(uuid: string) {
    setIsLoading(true);
    favRepoClass.delete(uuid)
      .then((_res) => {
        setIsLoading(false);
        const filteredFavs = favs.filter((favElem) => favElem.pin.uuid !== uuid);
        setFavs(filteredFavs);
      })
      .catch((_err) => {
        setIsLoading(false);
      })
  }

  function getFavPinBgImg(favElem: PinProps): string {
    if (favElem.image.length > 0 && favElem.image[0].cloud_pic !== undefined && favElem.image[0].cloud_pic !== '') {
      return favElem.image[0].cloud_pic;
    } else {
      return '/assets/mappoint-placeholder-img.jpg'
    }
  }

  if (initLoad) {
    return (
      <main className="relative w-full h-[calc(100%-56px)] flex justify-center items-center pb-20 text-white lg:pb-10 lg:mt-14">
        <LoadingSpinner />
      </main>
    )
  }

  return (
    <main
      className="relative w-full h-[calc(100%-56px)] flex justify-center items-center pb-20 text-white lg:pb-10 lg:mt-14">
      <div id="card-wrapper" className="w-full max-w-xl flex flex-col justify-start items-center lg:max-w-4xl">
        <h2 className="pt-14 pb-1 text-4xl">Favorites</h2>
        <h3 className="pb-7 text-lg font-light text-bright-seaweed">All your favorite places in one spot</h3>

        <div className="w-full flex flex-row justify-end items-center px-3 pb-10">
          {favs.length > 0 &&
            <EditButton triggerValue={editMode} setTrigger={setEditMode} />
          }
        </div>

        {favs.length === 0 &&
          <h3 className="px-3 text-xl text-bright-seaweed">Seems like you have no favorites yet</h3>
        }

        <ul className="w-full px-2">
          {favs.map((favElem: { pin: PinProps }) => (
            <div className="relative" key={`fav-elem-${favElem.pin.uuid}`}>
              <Link href={`/mappoint/${favElem.pin.uuid}`}>
                <li
                  className="w-full min-h-[7rem] grid grid-cols-4 mb-2 overflow-hidden border rounded-l-full border-lighter-sea cursor-pointer xs:grid-cols-3">
                  <div
                    style={{
                      backgroundImage: `url('${getFavPinBgImg(favElem.pin)}')`,
                      backgroundPosition: "40% 50%",
                    }}
                    className={`relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-cover bg-dark-seaweed bg-no-repeat`}>
                  </div>
                  <div className="col-span-3 pt-2 pr-3 ml-3 xs:col-span-2">
                    <h3 className="mb-1 text-lg xs:text-xl">{favElem.pin.title}</h3>
                    <p className="mb-4 font-light text-bright-seaweed">{favElem.pin.category}</p>
                  </div>
                </li>
              </Link>
              <AnimatePresence>
                {editMode &&
                  <motion.button
                    initial={{ x: '-30%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-30%', opacity: 0 }}
                    transition={{ ease: 'easeOut', duration: .2, opacity: { duration: .1 } }}
                    title="Delete this favorite"
                    aria-label="Delete this favorite"
                    onClick={() => handleDelete(favElem.pin.uuid)}
                    className="z-20 absolute top-1.5 right-2 w-7 h-7 p-1 bg-bright-seaweed rounded-full transition-colors xs:hover:bg-hovered-seaweed">
                    <CloseSvg width="100%" height="100%" fill="#FFF" />
                  </motion.button>
                }
              </AnimatePresence>
            </div>
          ))}
        </ul>
      </div>
      {isLoading &&
        <LoadingSpinner />
      }
    </main>
  );
}

export default Favorites;
