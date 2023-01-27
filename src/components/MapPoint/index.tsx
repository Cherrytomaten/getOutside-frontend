import CloseSvg from '@/resources/svg/Close';
import RenderStars from '@/components/MapPoint/StarRendering';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import ExpandSvg from '@/resources/svg/Expand';
import Link from 'next/link';
import axios from 'axios';
import { UserRepoClass } from '@/repos/UserRepo';
import { AuthStateMachine } from '@/types/Auth';
import { getSelectorsByUserAgent } from 'react-device-detect';
import { UserAuthProps } from '@/types/User';
import { logger } from '@/util/logger';

type MapPointPayloadProps = MapPointProps & {
  category: any | null;
  creator_id: any | null;
  longitude: number;
  latitude: number;
};

function MapPoint({ ...props }: MapPointPayloadProps) {
  // Review
  const allStars: JSX.Element[] = RenderStars(props.rating, '34', '34');
  const minimumComments: number = 2;
  const [counter, setCounter] = useState<number>(minimumComments); // Counter for number of shown comments
  const isMounted = useRef(false); // used to check if the component did mount for the first time
  const [expandDesc, setExpandDesc] = useState<boolean>(false); // boolean to open the description
  const [descSize, setDescSize] = useState<number>(0); // description size - workaround for the arrow to show right
  const [showRating, setShowRating] = useState<boolean>(false);
  const [comments, setComments] = useState<number[]>([]);
  const [comment, setComment] = useState('');
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
      console.log('No more comments.');
    }
  }

  const handleChange = (event: any) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    //clear textArea with ID ????
    event.preventDefault();
    const mappointPin_id = props.id;
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
      console.log('Can not show less comments.');
    }
  }

  return (
    <main
      id={'mappoint-id-' + props.id}
      className="relative w-full h-full min-h-screen flex justify-center p-5 mb-12 text-default-font"
    >
      <div id="card-wrapper" className="min-w-0 max-w-sm">
        <div className="relative w-full mb-8 overflow-hidden rounded-t-3xl">
          <Image
            src={props.image.src}
            alt={props.image.alt}
            height={props.image.height}
            width={props.image.width}
          />
          <Link href="/home">
            <button
              id="close-button"
              className="absolute top-2 right-2 bg-dark-sea/50 rounded-full hover:cursor-pointer"
              title="Close"
            >
              <CloseSvg width="40px" height="40px" fill="#f0f0f0" />
            </button>
          </Link>
        </div>
        <div
          id="lower-wrapper"
          className="flex flex-col justify-between align-center"
        >
          <div className="mb-4 text-3xl text-center">
            <h1>{props.name}</h1>
          </div>
          <div className="mb-[10%] text-center">
            <ul title={`Average Rating: ${props.rating.toString()}`}>
              {allStars.map((star, index) => (
                <li key={index} className="inline">
                  {star}
                </li>
              ))}
            </ul>
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
                onClick={() => setShowRating(!showRating)}
              >
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
                  onClick={() => setShowRating(!showRating)}
                >{`${props.rating} Stars`}</motion.button>
              )}
            </div>
          </div>
          <div className="flex-1">
            {/* Beschreibung */}
            <div className="mb-5">
              <h3 className="mb-1 text-lg">Description:</h3>
              <div
                style={{
                  maxHeight: expandDesc
                    ? calcDescElemHeightToString(
                        calcDescElemHeight('desc-text-elem')
                      )
                    : '5.65rem',
                }}
                className={`ease via-dark-seaweed to-dark-sea mq-hover:hover:bg-pos-100 mq-hover:hover:shadow-darker-sea relative p-3 overflow-hidden bg-gradient-to-br bg-size-200 bg-pos-0 from-dark-seaweed rounded-xl transition-all duration-200 hover:cursor-pointer group`}
                onClick={() => setExpandDesc(!expandDesc)}
              >
                <p id="desc-text-elem">{props.desc}</p>
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
                    className="z-10 mq-hover:group-hover:bg-dark-sea-semi-transparent absolute right-[5px] bottom-[5px] bg-dark-seaweed rounded-full"
                  >
                    <ExpandSvg width="30" height="30" />
                  </motion.button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* Adresse */}
            <div className="mb-5">
              <h3 className="mb-1 text-lg">Address:</h3>
              <div className="flex p-3 bg-dark-seaweed rounded-xl">
                <p>{props.address}</p>
              </div>
            </div>
            {/* Öffnungszeiten */}
            <div className="mb-5">
              <h3 className="mb-1 text-lg">Opening Hours:</h3>
              <div className="flex p-3 bg-dark-seaweed rounded-xl">
                <ul>
                  <li>
                    <span className="text-bright-seaweed">Monday: </span>
                    {props.opening.monday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Tuesday: </span>
                    {props.opening.tuesday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Wednesday: </span>
                    {props.opening.wednesday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Thursday: </span>
                    {props.opening.thursday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Friday: </span>
                    {props.opening.friday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Saturday: </span>
                    {props.opening.saturday}
                  </li>
                  <li>
                    <span className="text-bright-seaweed">Sunday: </span>
                    {props.opening.sunday}
                  </li>
                </ul>
              </div>
            </div>
            {/* Kommentare */}
            <div className="mb-5">
              <form onSubmit={handleSubmit}>
                <h3 className="mb-.5 text-lg">Comments:</h3>
                <textarea
                  id="commentsTextArea"
                  value={comment}
                  className="w-full p-1 mt-1 text-white bg-transparent border rounded-md"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a comment..."
                  // rows="1"
                ></textarea>
                <input
                  type="submit"
                  value="Post comment"
                  id="signup-btn-submit"
                  className="flex-auto w-full p-1 mt-1 mb-5 font-bold text-white bg-bright-seaweed border-solid border rounded-md transition-colors cursor-pointer"
                />
              </form>
              <ul>
                {props.comments.length === 0 ? (
                  <p className="min-h-[65px] flex flex-col justify-around p-3 mb-3 bg-dark-seaweed rounded-xl">
                    There are no existing comments yet...
                  </p>
                ) : (
                  <>
                    <AnimatePresence>
                      {showComments().map((comment, index) => (
                        <motion.div
                          key={index}
                          className="min-h-[65px] flex flex-col justify-around p-3 mb-3 bg-dark-seaweed rounded-xl"
                          initial={{ y: -100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -100, opacity: 0, position: 'absolute' }}
                        >
                          <li className="flex-auto">
                            <span className="text-bright-seaweed">Author:</span>{' '}
                            {comment.author}
                          </li>
                          <li className="flex-auto">
                            <span className="text-bright-seaweed">
                              Message:
                            </span>{' '}
                            {comment.text}
                          </li>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="w-full h-12 flex justify-around">
                      <button
                        id="show-more-comments-btn"
                        className={` ${
                          counter < props.comments.length ? '' : 'hidden'
                        } flex-auto w-full h-full border-solid border rounded-full border-bright-seaweed transition-all mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed`}
                        onClick={showMoreComments}
                      >
                        Show More
                      </button>
                      <div
                        className={` ${
                          counter > minimumComments &&
                          counter < props.comments.length
                            ? ''
                            : 'hidden'
                        }  h-full w-5`}
                      ></div>
                      <button
                        id="show-less-comments-btn"
                        className={` ${
                          counter > minimumComments ? '' : 'hidden'
                        } flex-auto w-full h-full border-solid border rounded-full border-bright-seaweed transition-all mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed`}
                        onClick={showLessComments}
                      >
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
    </main>
  );
}

export { MapPoint };
