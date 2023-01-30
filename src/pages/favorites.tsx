import { GetServerSidePropsContext } from "next";
import { TokenPayload } from "@/types/Auth/TokenPayloadProps";
import axios, { AxiosResponse } from "axios";
import { logger } from "@/util/logger";
import { BackendErrorResponse } from "@/types/Backend/BackendErrorResponse";
import { AUTH_TOKEN } from "@/types/constants";
import { PinProps } from "@/types/Pins";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EditButton } from "@/components/Favorites/EditButton";
import CloseSvg from "@/resources/svg/Close";
import { AnimatePresence, motion } from "framer-motion";
import { favRepoClass } from "@/repos/FavRepo";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type FavoritePageProps = {
  favorites: {
    pin: PinProps
  }[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const tokenData: string | undefined = context.req.cookies[AUTH_TOKEN];

  try {
    if (tokenData === undefined || tokenData === "undefined") {
      throw new Error("TokenData is undefined!");
    }

    const authToken: TokenPayload = JSON.parse(tokenData);

    return await axios
      .get("https://cherrytomaten.herokuapp.com/api/favorites/pin/", {
        headers: {
          Authorization: "Bearer " + authToken.token,
        },
      })
      .then((_res: AxiosResponse<PinProps>) => {
        return {
          props: {
            favorites: _res.data,
          },
        };
      })
      .catch((_err: BackendErrorResponse) => {
        throw new Error("Internal Server Error.");
      });
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
  const [favs, setFavs] = useState<{ pin: PinProps }[]>(props.favorites);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showFilterFav, setShowsFilterFav] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setFavs(props.favorites);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDelete(uuid: string) {
    setIsLoading(true);
    favRepoClass.delete(uuid)
      .then((_res) => {
        setIsLoading(false);
        setFavs(favs.filter((favElem) => favElem.pin.uuid !== uuid));
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      })
  }

  return (
    <main
      className="relative w-full h-[calc(100%-56px)] flex justify-center items-center pb-20 text-white lg:pb-10 lg:mt-14">
      <div id="card-wrapper" className="w-full max-w-xl flex flex-col justify-start items-center lg:max-w-4xl">
        <h2 className="pt-14 pb-1 text-4xl">Favorites</h2>
        <h3 className="pb-7 text-lg font-light text-bright-seaweed">All your favorites place on one spot</h3>

        <div className="pb-10">
          <EditButton triggerValue={editMode} setTrigger={setEditMode} />
        </div>

        {props.favorites.length === 0 &&
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
                      backgroundImage: `url('${"https://cherrytomaten.herokuapp.com" + favElem.pin.image[0]?.image}')`,
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
