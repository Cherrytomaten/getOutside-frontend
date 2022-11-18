import CloseSvg from '@/resources/svg/Close';
import RenderStars from '@/components/Pins/StarRendering';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

type PinProps = {
  uuid: string;
  name: string;
  desc: string;
  address: string;
  opening: OpeningProps;
  rating: number;
  comments: CommentProps[];
  image: ImageProps;
};

function Pins({ ...props }: PinProps) {
  // Review
  const allStars: JSX.Element[] = RenderStars(props.rating, '34', '34');
  const ratingAsString = props.rating.toString();
  // Hooks
  const minimumComments: number = 2;
  const [counter, setCounter] = useState<number>(minimumComments); // Counter for number of shown comments
  const isMounted = useRef(false); // used to check if its components first mount
  const [expandDesc, setExpandDesc] = useState<boolean>(false); // boolean to open the description

  // automatically scroll down if a new comment appears
  // neglect this behavior on first mounting of component
  useEffect(() => {
    if (isMounted.current) {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      isMounted.current = true;
    }
  }, [counter]);

  // display a number of comments depending on the counter (Hook)
  function showComments() {
    return props.comments.slice(0, counter);
  }

  function calcDescElemHeight(id: string): string {
    const elemHeight = document.getElementById(id)?.offsetHeight;
    if (elemHeight !== null && elemHeight) {
      // returns height of elem calculated with the parents padding
      return (elemHeight + (2 * 12)) + "px";
    }

    return "auto";
  }

  // increment counter
  function showMoreComments() {
    if (counter < props.comments.length) {
      setCounter(counter + 1);
    } else {
      console.log('No more comments.');
    }
  }

  // decrement counter
  function showLessComments() {
    if (counter > minimumComments) {
      setCounter(counter - 1);
    } else {
      console.log('Can not show less comments.');
    }
  }

  // TODO: add functionality
  function closePopUp() {
    console.log('PopUp wird geschlossen.');
  }

  return (
    <section
      id={props.uuid}
      className="relative w-full h-screen flex justify-center p-5 text-default-font"
    >
      <div id="card-wrapper" className="min-w-0 max-w-sm">
        <div className="relative w-full mb-8 overflow-hidden rounded-t-3xl">
          <Image
            src={props.image.src}
            alt={props.image.alt}
            height={props.image.height}
            width={props.image.width}
          />
          <div
            id="close-button"
            className="absolute top-2 right-2 bg-default-font/50 rounded-full hover:cursor-pointer"
            onClick={closePopUp}
          >
            <CloseSvg width="40" height="40" />
          </div>
        </div>
        <div
          id="lower-wrapper"
          className="flex flex-col justify-between align-center"
        >
          <div className="mb-4 text-3xl text-center">
            <h1>{props.name}</h1>
          </div>
          <div className="mb-[10%] text-center">
            <ul title={`Bewertung: ${ratingAsString}`}>
              {allStars.map((star, index) => (
                <li key={index} className="inline">
                  {star}
                </li>
              ))}
            </ul>
            <p>
              {/* TODO: add functionality */}
              <a href="#">See Reviews</a>
            </p>
          </div>
          <div className="flex-1">
            {/* Beschreibung */}
            <div className="mb-5">
              <h3 className="mb-1 text-lg">Description:</h3>
              <div
                // using style because it's faster to render than tailwind
                style={{ maxHeight: expandDesc ? calcDescElemHeight('desc-text-elem') : '5rem' }}
                className="ease via-dark-seaweed to-dark-sea p-3 overflow-hidden bg-gradient-to-br bg-size-200 bg-pos-0 from-dark-seaweed rounded-xl transition-all duration-200 hover:bg-pos-100 hover:shadow-custom hover:cursor-pointer"
                onClick={() => setExpandDesc(!expandDesc)}
              >
                <p
                    id="desc-text-elem"
                // className={expandDesc ? '' : 'truncate'}
                >
                  {props.desc}
                </p>
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
              <h3 className="mb-1 text-lg">Comments:</h3>
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
                          exit={{ x: -300, opacity: 0 }}
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
                        } flex-auto w-full h-full border-solid border rounded-full border-bright-seaweed transition-all hover:text-dark-sea hover:bg-bright-seaweed`}
                        onClick={showMoreComments}
                      >
                        Show More
                      </button>
                      <div className={` ${(counter > minimumComments && counter < props.comments.length) ? '' : 'hidden'}  h-full w-5`}></div>
                      <button
                        id="show-less-comments-btn"
                        className={` ${
                          counter > minimumComments ? '' : 'hidden'
                        } flex-auto w-full h-full border-solid border rounded-full border-bright-seaweed transition-all≤≤≤≤≤ hover:text-dark-sea hover:bg-bright-seaweed`}
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
    </section>
  );
}

export { Pins };
