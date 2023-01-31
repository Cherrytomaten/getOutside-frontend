import CloseSvg from '@/resources/svg/Close';
import RenderStars from '@/components/MapPoint/StarRendering';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ExpandSvg from '@/resources/svg/Expand';
import Link from 'next/link';
import axios from 'axios';
import { UserRepoClass } from '@/repos/UserRepo';
import { logger } from '@/util/logger';
import { Bookmark } from "@/resources/svg/Bookmark";
import { BookmarkCrossed } from "@/resources/svg/BookmarkCrossed";
import { favRepoClass } from "@/repos/FavRepo";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";

type MappointProps = {
  category: any | null;
  creator: string;
  longitude: number;
  latitude: number;
  uuid: string;
  title: string;
  description: string;
  address: string;
  openingHours: OpeningProps;
  rating: number;
  comments: CommentProps[];
  image: ImageProps[];
  isFavorite: boolean;
}

function MapPoint({ ...props }: MappointProps) {
  const allStars: JSX.Element[] = RenderStars(props.rating, '34', '34');
  const minimumComments: number = 2;
  const [counter, setCounter] = useState<number>(minimumComments); // Counter for number of shown comments
  const isMounted = useRef(false); // used to check if the component did mount for the first time
  const [expandDesc, setExpandDesc] = useState<boolean>(false); // boolean to open the description
  const [descSize, setDescSize] = useState<number>(0); // description size - workaround for the arrow to show right
  const [showRating, setShowRating] = useState<boolean>(false);
  const [comments, setComments] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(props.isFavorite);
  const commentArray: CommentProps[] = props.comments;

  // automatically scroll down if a new comment appears
  // neglect this behavior on first mounting of component
  useEffect(() => {
    if (isMounted.current) {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      isMounted.current = true;
      calcDescElemHeight('desc-text-elem');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  // display a number of comments depending on the counter (Hook)
  function showComments(): CommentProps[] {
    return commentArray.slice(0, counter);
  }

  // calculates height of elem considering parents
  function calcDescElemHeight(id: string): number {
    const elemHeight = document.getElementById(id)?.offsetHeight;
    if (elemHeight !== null && elemHeight) {
      // returns height of elem calculated with the parents padding
      if (descSize != elemHeight + 2 * 12) {
        setDescSize(elemHeight + 2 * 12);
      }
      return elemHeight + 2 * 12;
    }

    return 0;
  }

  function calcDescElemHeightToString(height: number): string {
    if (height === 0) {
      return 'auto';
    } else {
      return height + 'px';
    }
  }

  // increment counter
  function showMoreComments(): void {
    if (counter < props.comments.length) {
      setCounter(counter + 1);
    } else {
      logger.log('No more comments.');
    }
  }

  const handleChange = (event: any) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    //clear textArea with ID ????
    event.preventDefault();
    const mappointPin_id = props.uuid;
    if (comment)
      try {
        const text = comment;
        addComment(text);
        setComment('');
        const response = await axios.post('/api/comments', {
          text,
          mappointPin_id,
        });
        logger.log(response.data);
      } catch (err) {
        logger.log(err);
      }
  };

  function handleKeyDown(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  async function addComment(comment: string) {
    await UserRepoClass.getUserData().then((res: any) => {
      const messageObj: CommentProps = {
        author: res.username,
        text: comment,
      };
      const newCommentsArray = commentArray.unshift(messageObj);
      setComments([newCommentsArray]);
    });
  }

  // decrement counter
  function showLessComments(): void {
    if (counter > minimumComments) {
      setCounter(counter - 1);
    } else {
      logger.log('Can not show less comments.');
    }
  }

  function addToFavorites(pinId: string) {
    if (isLoading || pinId === undefined) {
      return;
    }

    setIsLoading(true);
    favRepoClass.add(pinId)
      .then((_res) => {
        setIsLoading(false);
        setIsFavorite(true);
      })
      .catch((_err) => {
        setIsLoading(false);
      })
  }

  function removeFromFavorites(pinId: string) {
    if (isLoading || pinId === undefined) {
      return;
    }

    setIsLoading(true);
    favRepoClass.delete(pinId)
      .then((_res) => {
        setIsLoading(false);
        setIsFavorite(false);
      })
      .catch((_err: FetchServerErrorResponse) => {
        if (_err.errors.message === 'Object with id does not exists') {
          setIsFavorite(false);
        }
        setIsLoading(false);
      })
  }

  function getBgImg() {
    return (props.image[0]?.cloud_pic === undefined || props?.image[0].cloud_pic === "") ? '/assets/mappoint-placeholder-img.jpg' : props?.image[0].cloud_pic;
  }
  return (
    <main id={'mappoint-id-' + props.uuid} className="relative w-full h-full min-h-screen flex justify-center p-5 mb-12 text-default-font lg:pt-14">
      <div id="card-wrapper" className="min-w-0 max-w-xl lg:w-full lg:max-w-4xl lg:flex lg:flex-col lg:justify-start lg:items-center">
        <div className="relative w-full mb-8 overflow-hidden rounded-t-3xl">
          <div
            style={{ backgroundImage: `url('${getBgImg()}')` }}
            className="w-full h-80 flex flex-col justify-center items-center overflow-hidden bg-no-repeat bg-center bg-cover lg:h-[450px]">
          </div>
          <Link href="/home">
            <button
              className="z-[99] modest-shadow absolute top-4 right-4 w-10 h-10 p-2 opacity-90 bg-bright-seaweed rounded-full transition-all hover:xs:opacity-100 hover:xs:bg-hovered-seaweed">
              <CloseSvg width="100%" height="100%" fill="#fff" />
            </button>
          </Link>
          {isFavorite
          ? (
              <button
                className="z-[99] modest-shadow absolute top-20 right-4 w-10 h-10 p-2 opacity-90 bg-bright-seaweed rounded-full transition-all hover:xs:opacity-100 hover:xs:bg-hovered-seaweed"
                title="Add to favorites"
                aria-label="Add point to your favorites"
                onClick={() => removeFromFavorites(props.uuid)}
              >
                <BookmarkCrossed width="100%" height="100%" fill="#fff" />
              </button>
            )
            : (
              <button
                className="z-[99] modest-shadow absolute top-20 right-4 w-10 h-10 p-2 opacity-90 bg-bright-seaweed rounded-full transition-all hover:xs:opacity-100 hover:xs:bg-hovered-seaweed"
                title="Remove from favorites"
                aria-label="Remove point from your favorites"
                onClick={() => addToFavorites(props.uuid)}
              >
                <Bookmark width="100%" height="100%" fill="#fff" />
              </button>
            )
          }

        </div>
        <div id="lower-wrapper" className="w-full max-w-xl flex flex-col justify-between align-center">
          <div className="mb-4 text-3xl text-center">
            <h1>{props.title}</h1>
          </div>
          <div className="mb-[10%] text-center">
            {props.rating !== null &&
              <ul title={`Average Rating: ${props.rating.toString()}`}>
                {allStars.map((star, index) => (
                  <li key={index} className="inline">
                    {star}
                  </li>
                ))}
              </ul>
            }
            <div className="relative w-full h-9 mt-4">
              <motion.button
                initial={{ opacity: 1 }}
                animate={showRating ? { opacity: 0 } : { opacity: 1 }}
                transition={{
                  ease: 'easeOut',
                  duration: 0.2,
                }}
                type="button"
                className="absolute top-0 right-[50%] left-[50%] w-[7.75rem] h-9 translate-x-[-50%] text-default-font border-solid border-2 rounded-md border-dark-seaweed"
                onClick={() => setShowRating(!showRating)}>
                Average Rating
              </motion.button>
              {showRating && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={showRating ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    ease: 'easeOut',
                    duration: 0.2,
                  }}
                  exit={{ opacity: 0 }}
                  type="button"
                  className="absolute top-0 right-[50%] left-[50%] w-[7.75rem] h-9 translate-x-[-50%] text-default-font bg-dark-seaweed rounded-md"
                  onClick={() => setShowRating(!showRating)}>{`${props.rating} Stars`}</motion.button>
              )}
            </div>
          </div>
          <div className="flex-1">
            {/* Beschreibung */}
            <div className="mb-5">
              <h3 className="mb-1 text-lg">Description</h3>
              <div
                style={{
                  maxHeight: expandDesc ? calcDescElemHeightToString(calcDescElemHeight('desc-text-elem')) : '5.65rem',
                }}
                className={`ease via-dark-seaweed to-dark-sea mq-hover:hover:bg-pos-100 mq-hover:hover:shadow-darker-sea relative p-3 overflow-hidden bg-gradient-to-br bg-size-200 bg-pos-0 from-dark-seaweed rounded-xl transition-all duration-200 hover:cursor-pointer group`}
                onClick={() => setExpandDesc(!expandDesc)}>
                <p id="desc-text-elem">{props.description}</p>
                {descSize > 90.4 ? (
                  <motion.button
                    initial={{ rotate: 0 }}
                    animate={expandDesc ? { rotate: 180 } : { rotate: 0 }}
                    transition={{
                      type: 'spring',
                      duration: 0.35,
                      delay: 0,
                      stiffness: 70,
                    }}
                    className="z-10 mq-hover:group-hover:bg-dark-sea-semi-transparent absolute right-[5px] bottom-[5px] bg-dark-seaweed rounded-full">
                    <ExpandSvg width="30" height="30" />
                  </motion.button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* Adresse */}
            <div className="mb-5">
              <h3 className="mb-1 text-lg">Address</h3>
              <div className="flex p-3 bg-dark-seaweed rounded-xl">
                <p>{props.address}</p>
              </div>
            </div>
            {/* Öffnungszeiten */}
            <div className="mb-5">
              <h3 className="mb-1 text-lg">Opening Hours</h3>
              <div className="flex p-3 bg-dark-seaweed rounded-xl">
                <ul>
                  <li>
                    <span className="text-bright-seaweed">Monday: </span>
                    {props.openingHours.monday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Tuesday: </span>
                    {props.openingHours.tuesday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Wednesday: </span>
                    {props.openingHours.wednesday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Thursday: </span>
                    {props.openingHours.thursday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Friday: </span>
                    {props.openingHours.friday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Saturday: </span>
                    {props.openingHours.saturday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Sunday: </span>
                    {props.openingHours.sunday}
                  </li>
                </ul>
              </div>
            </div>
            {/* Kommentare */}
            <div className="mb-5">
              <form onSubmit={handleSubmit}>
                <h3 className="mb-.5 text-lg">Comments</h3>
                <textarea
                  id="commentsTextArea"
                  value={comment}
                  className="w-full px-3 py-2 mt-1 text-white bg-transparent border rounded-md border-lighter-sea"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a comment..."
                  // rows="1"
                ></textarea>
                <input
                  type="submit"
                  value="Post comment"
                  id="signup-btn-submit"
                  className="flex-auto w-full p-2 mt-1 mb-5 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed"
                />
              </form>
              <ul>
                {props.comments.length === 0 ? (
                  <p className="min-h-[65px] flex flex-col justify-around p-3 mb-3 bg-dark-seaweed rounded-xl">There are no existing comments yet...</p>
                ) : (
                  <>
                    <AnimatePresence>
                      {showComments().map((comment: CommentProps, index) => (
                        <motion.div
                          key={index}
                          className="relative min-h-[65px] flex flex-col justify-around p-3 pb-9 mb-3 bg-dark-seaweed rounded-xl"
                          initial={{ y: -100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -100, opacity: 0, position: 'absolute' }}>
                          <p className="text-white">{comment.text}</p>
                          <p className="absolute right-5 bottom-2 font-light text-bright-seaweed">{comment.author.username}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="w-full h-12 flex justify-around">
                      <button
                        id="show-more-comments-btn"
                        className={` ${
                          counter < props.comments.length ? '' : 'hidden'
                        } flex-auto w-full h-full border-solid border rounded-full border-bright-seaweed transition-all mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed`}
                        onClick={showMoreComments}>
                        Show More
                      </button>
                      <div className={` ${counter > minimumComments && counter < props.comments.length ? '' : 'hidden'}  h-full w-5`}></div>
                      <button
                        id="show-less-comments-btn"
                        className={` ${
                          counter > minimumComments ? '' : 'hidden'
                        } flex-auto w-full h-full border-solid border rounded-full border-bright-seaweed transition-all mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed`}
                        onClick={showLessComments}>
                        Show Less
                      </button>
                    </div>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {isLoading &&
        <LoadingSpinner />
      }
    </main>
  );
}

export { MapPoint };
