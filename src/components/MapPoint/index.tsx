import CloseSvg from '@/resources/svg/Close';
import { RenderStars, calcAverage, getUserRating } from '@/components/MapPoint/StarRendering';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ExpandSvg from '@/resources/svg/Expand';
import Link from 'next/link';
import { UserRepoClass } from '@/repos/UserRepo';
import { logger } from '@/util/logger';
import { Bookmark } from '@/resources/svg/Bookmark';
import { BookmarkCrossed } from '@/resources/svg/BookmarkCrossed';
import { favRepoClass } from '@/repos/FavRepo';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { commentsService } from '@/services/Comments';
import DeleteSvg from '@/resources/svg/Delete';
import { InfoPopup } from '@/components/InfoPopup';
import { ratingService } from '@/services/Ratings';
import { SwiperModule } from './Swiper';

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
  ratings: RatingProps[];
  comments: CommentProps[];
  image: ImageProps[];
  isFavorite: boolean;
  userId: string;
};

function MapPoint({ ...props }: MappointProps) {
  const [allStars, setAllStars] = useState<JSX.Element[]>(RenderStars(props.ratings, '34', '34'));
  const [averageRating, setAverageRating] = useState<number>(calcAverage(props.ratings));
  const [userRating, setUserRating] = useState<number>(getUserRating(props.ratings, props.userId));
  const minimumComments: number = 2;
  const [counter, setCounter] = useState<number>(minimumComments); // Counter for number of shown comments
  const [comment, setComment] = useState<string>('');
  const [commentAddErr, setCommentAddErr] = useState<string>('');
  const [commentDelErr, setCommentDelErr] = useState<string>('');
  const [commentArray, setCommentArray] = useState<CommentProps[]>(props.comments);
  const isMounted = useRef(false); // used to check if the component did mount for the first time
  const [expandDesc, setExpandDesc] = useState<boolean>(false); // boolean to open the description
  const [descSize, setDescSize] = useState<number>(0); // description size - workaround for the arrow to show right
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(props.isFavorite);

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

  function handleRating(index: number) {
    try {
      if (index === undefined || index === null) {
        throw new Error('Rating Index must not be null!');
      }

      const userRating: number = index + 1; // index starts with 0

      ratingService
        .postNewRating(userRating, props.uuid)
        .then((res: any) => {
          logger.log('Rating successful.');
          logger.log('res-rating:', res.data.rating);
          setAverageRating(calcAverage(props.ratings, res.data.rating, res.data.creator));
          setAllStars(RenderStars(props.ratings, '34', '34', res.data.rating, res.data.creator));
          setUserRating(getUserRating(props.ratings, props.userId, res.data.rating));
        })
        .catch((err: FetchServerErrorResponse) => {
          logger.log('Error occured by rating:', err.errors.message);
        });
    } catch (err: any) {
      logger.log('Error occured by rating:', err);
    }
  }

  // display a number of comments depending on the counter (Hook)
  function showComments(): CommentProps[] {
    return commentArray.slice(0, counter);
  }

  // increment counter
  function showMoreComments(): void {
    if (counter < props.comments.length) {
      setCounter(counter + 1);
    } else {
      logger.log('No more comments.');
    }
  }

  // decrement counter
  function showLessComments(): void {
    if (counter > minimumComments) {
      setCounter(counter - 1);
    } else {
      logger.log('Can not show less comments.');
    }
  }

  // handle comment input change
  const handleChange = (event: any) => {
    if (event.target.value.length > 255) {
      setCommentAddErr('Comment can not be longer than 255 characters!');
      setComment(event.target.value);
    } else {
      setCommentAddErr('');
      setComment(event.target.value);
    }
  };

  // handle post comment submit
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const mappointId = props.uuid;

    if (comment && commentAddErr === '')
      try {
        if (comment.length > 255) {
          setCommentAddErr('Comment can not be longer than 255 Characters!');
          throw new Error('Comment can not be longer than 255 Characters.');
        }

        commentsService
          .postNewComment({ mappointId: mappointId, text: comment })
          .then((res: any) => {
            logger.log('New comment created.');
            addComment(res.data.text, res.data.author, res.data.uuid);
          })
          .catch((err: FetchServerErrorResponse) => {
            logger.log('Error occured by adding comment:', err.errors.message);
            setCommentAddErr(JSON.stringify(err.errors.message));
          });
      } catch (err) {
        logger.log('Could not add new comment:', err);
      }
  };

  // handle posting comments by pressing enter
  function handleKeyDown(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  // add comment in frontend
  async function addComment(comment: string, authorId: string, commentId: string) {
    await UserRepoClass.getUserData().then((res: any) => {
      const messageObj: CommentProps = {
        author: {
          username: res.username,
          uuid: authorId,
          cloud_pic: res.pfp,
        },
        text: comment,
        uuid: commentId,
      };
      commentArray.unshift(messageObj);
      setComment('');
    });
  }

  // handle comment delete
  async function handleDeleteSubmit(commentId: string) {
    setCommentDelErr('');

    try {
      commentsService
        .deleteComment(commentId)
        .then((_res: any) => {
          logger.log('Comment deleted successfully');
          removeComment(commentId);
        })
        .catch((err: FetchServerErrorResponse) => {
          logger.log('Error occured by removing a comment:', err.errors.message);
          setCommentDelErr(err.errors.message);
        });
    } catch (err) {
      logger.log('Could not delete comment:', err);
      setCommentDelErr('Deleting comment was unsuccessful.');
    }
  }

  function removeComment(commentId: string) {
    for (let i = 0; i < commentArray.length; i++) {
      if (commentArray[i].uuid === commentId) {
        commentArray.splice(i, 1);
      }
    }

    setCommentArray([...commentArray]);
  }

  function getUserImage(url: string | null) {
    return url === null || url === '' ? '/assets/ProfilePictureDefault.png' : url;
  }

  function addToFavorites(pinId: string) {
    if (isLoading || pinId === undefined) {
      return;
    }

    setIsLoading(true);
    favRepoClass
      .add(pinId)
      .then((_res) => {
        setIsLoading(false);
        setIsFavorite(true);
      })
      .catch((_err) => {
        setIsLoading(false);
      });
  }

  function removeFromFavorites(pinId: string) {
    if (isLoading || pinId === undefined) {
      return;
    }

    setIsLoading(true);
    favRepoClass
      .delete(pinId)
      .then((_res) => {
        setIsLoading(false);
        setIsFavorite(false);
      })
      .catch((_err: FetchServerErrorResponse) => {
        if (_err.errors.message === 'Object with id does not exists') {
          setIsFavorite(false);
        }
        setIsLoading(false);
      });
  }

  function getBgImg() {
    return props.image[0]?.cloud_pic === undefined || props?.image[0].cloud_pic === '' ? '/assets/mappoint-placeholder-img.jpg' : props?.image[0].cloud_pic;
  }

  function useSwiper(): boolean {
    return props.image.length > 1;
  }

  return (
    <main id={'mappoint-id-' + props.uuid} className="relative w-full h-full min-h-screen flex justify-center p-5 mb-12 text-default-font lg:pt-14">
      <div id="card-wrapper" className="min-w-0 max-w-xl lg:w-full lg:max-w-4xl lg:flex lg:flex-col lg:justify-start lg:items-center">
        <div className="relative w-full mb-8 overflow-hidden rounded-t-3xl">
          {useSwiper() ? (
            <div className="w-full h-80 lg:h-[450px]">
              <SwiperModule pictures={props.image} />
            </div>
          ) : (
            <div
              style={{ backgroundImage: `url('${getBgImg()}')` }}
              className="w-full h-80 flex flex-col justify-center items-center overflow-hidden bg-no-repeat bg-center bg-cover lg:h-[450px]"></div>
          )}
          <Link href="/home">
            <button className="z-[99] modest-shadow absolute top-4 right-4 w-10 h-10 p-2 opacity-90 bg-bright-seaweed rounded-full transition-all hover:xs:opacity-100 hover:xs:bg-hovered-seaweed">
              <CloseSvg width="100%" height="100%" fill="#fff" />
            </button>
          </Link>
          {isFavorite ? (
            <button
              className="z-[99] modest-shadow absolute top-20 right-4 w-10 h-10 p-2 opacity-90 bg-bright-seaweed rounded-full transition-all hover:xs:opacity-100 hover:xs:bg-hovered-seaweed"
              title="Add to favorites"
              aria-label="Add point to your favorites"
              onClick={() => removeFromFavorites(props.uuid)}>
              <BookmarkCrossed width="100%" height="100%" fill="#fff" />
            </button>
          ) : (
            <button
              className="z-[99] modest-shadow absolute top-20 right-4 w-10 h-10 p-2 opacity-90 bg-bright-seaweed rounded-full transition-all hover:xs:opacity-100 hover:xs:bg-hovered-seaweed"
              title="Remove from favorites"
              aria-label="Remove point from your favorites"
              onClick={() => addToFavorites(props.uuid)}>
              <Bookmark width="100%" height="100%" fill="#fff" />
            </button>
          )}
        </div>
        <div id="lower-wrapper" className="w-full max-w-xl flex flex-col justify-between align-center">
          <div className="mb-4 text-3xl text-center">
            <h1>{props.title}</h1>
          </div>
          <div className="box-border mb-[10%] text-center">
            {props.ratings === null || props.ratings === undefined ? (
              <ul title="Unrated">
                {allStars.map((star, index) => (
                  <li key={index} className="inline-block cursor-pointer hover:mb-[-2px] hover:border-b-star-color hover:border-b-2" onClick={() => handleRating(index)}>
                    {star}
                  </li>
                ))}
              </ul>
            ) : (
              <ul title={`Average Rating: ${averageRating !== undefined ? averageRating.toString() : ""}`}>
                {allStars.map((star, index) => (
                  <li
                    key={index}
                    className={`inline-block cursor-pointer hover:mb-[-2px] hover:border-b-star-color hover:border-b-2 ${userRating === index + 1 && 'mb-[-2px] border-b-star-color border-b-2'}`}
                    onClick={() => handleRating(index)}>
                    {star}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-center mt-4">
              <div className="px-4 py-2 text-default-font bg-dark-seaweed rounded-xl">{`Average Rating: ${averageRating} Stars`}</div>
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
              <form onSubmit={handleSubmit} className="mb-4">
                <h3 className="text-lg">Comments</h3>
                <textarea
                  id="commentsTextArea"
                  value={comment}
                  className="w-full px-3 py-2 mt-1 text-white bg-transparent border rounded-md border-lighter-sea"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setCommentAddErr('')}
                  placeholder="Add a comment..."></textarea>
                <AnimatePresence>
                  {commentAddErr !== '' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                      <p className="input-error-text mt-1 text-danger">{commentAddErr}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="submit"
                  value="Post comment"
                  id="signup-btn-submit"
                  className="flex-auto w-full h-12 mt-2 mb-4 text-dark-sea bg-bright-seaweed rounded-full transition-colors cursor-pointer hover:bg-hovered-seaweed"
                />
              </form>
              <ul>
                {props.comments.length === 0 ? (
                  <p className="min-h-[65px] flex flex-col justify-around p-3 mb-3 bg-dark-seaweed rounded-xl">There are no comments yet...</p>
                ) : (
                  <>
                    <AnimatePresence>
                      {showComments().map((comment: CommentProps) => (
                        <motion.div
                          key={'comment-' + comment.uuid}
                          className="relative min-h-[65px] flex flex-col justify-around p-3 pb-9 mb-3 bg-dark-seaweed rounded-xl"
                          initial={{ y: -100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -100, opacity: 0, position: 'absolute' }}>
                          <p className="text-white">{comment.text}</p>
                          <p className="absolute right-12 bottom-2 font-light text-bright-seaweed">{comment.author.username}</p>
                          <div
                            style={{ backgroundImage: `url('${getUserImage(comment.author.cloud_pic)}')` }}
                            className="full absolute right-5 bottom-2.5 w-5 h-5 bg-no-repeat bg-center bg-cover rounded-full"></div>
                          {comment.author.uuid === props.userId && (
                            <p className="absolute bottom-2 left-2 cursor-pointer" onClick={() => handleDeleteSubmit(comment.uuid)}>
                              <DeleteSvg width="auto" height="1.3rem" fill="#DD4352"></DeleteSvg>
                            </p>
                          )}
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
              {/* Error messages for deleting comments */}
              {commentDelErr !== '' && (
                <div className="w-full flex justify-center">
                  <div className="fixed bottom-0 w-4/5 min-w-[300px]">
                    <InfoPopup text={commentDelErr} exp={4000} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </main>
  );
}

export { MapPoint };
