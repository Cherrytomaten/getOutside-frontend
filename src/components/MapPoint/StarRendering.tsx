import RatingStar from '@/resources/svg/RatingStar';
import RatingStarFilled from '@/resources/svg/RatingStarFilled';
import RatingStarHalf from '@/resources/svg/RatingStarHalf';
import { logger } from '@/util/logger';

function RenderStars(ratings: RatingProps[] | null, width: string, height: string, newRating?: number, creator?: string): JSX.Element[] {
  let finalStars: JSX.Element[] = [];
  let isDecimalNumber: boolean = false;
  let decimalNumber: number = 0;

  // return 5 empty stars if format does not match
  if ((ratings === null || ratings.length < 1 || ratings === undefined) && !newRating) {
    for (let i = 1; i <= 5; i++) {
      finalStars.push(<RatingStar width={width} height={height} />);
    }
    return finalStars;
  }

  // calc average rating
  let avrgRating: number = 0;
  if (newRating && creator) {
    avrgRating = calcAverage(ratings, newRating, creator);
  } else {
    avrgRating = calcAverage(ratings);
  }

  // extract decimal place if number is not an Integer
  if (!Number.isInteger(avrgRating)) {
    decimalNumber = extractDecimalPlace(avrgRating);
    avrgRating = Math.floor(avrgRating);
    isDecimalNumber = true;
  }

  // fill array with full-filled stars
  for (let i = 1; i <= avrgRating; i++) {
    finalStars.push(<RatingStarFilled width={width} height={height} />);
  }

  // add a half star if decimal place >= 5
  if (isDecimalNumber && decimalNumber >= 5) {
    finalStars.push(<RatingStarHalf width={width} height={height} />);
  }

  // fill array with empty stars until its full
  if (finalStars.length < 5) {
    for (let i = finalStars.length; i < 5; i++) {
      finalStars.push(<RatingStar width={width} height={height} />);
    }
  }

  return finalStars;
}

function extractDecimalPlace(num: number): number {
  const roundedToOneDecimalPlace: number = Math.floor(num * 10) / 10;
  const cache: string = roundedToOneDecimalPlace.toString().split('.')[1];

  return Number(cache);
}

function calcAverage(ratings: RatingProps[] | null, newRating?: number, creator?: string): number {
  if (newRating === undefined || newRating === null || creator === undefined || creator === null) {
    if (ratings === null || ratings === undefined || ratings.length < 1) {
      return 0;
    }

    let sum: number = 0;

    for (let rating of ratings) {
      sum += rating.rating;
    }

    let average: number = sum / ratings.length;
    return Math.round(average * 10) / 10;
  } else {
    if (ratings === null || ratings === undefined || ratings.length < 1) {
      return newRating;
    }

    let sum: number = 0;
    let length: number = 0;
    let userRatingConsidered: boolean = false;

    for (let rating of ratings) {
      if (rating.creator !== creator) {
        sum += rating.rating;
      } else {
        sum += newRating;
        userRatingConsidered = true;
      }
      length++;
    }

    if (userRatingConsidered === false) {
      sum += newRating;
      length++;
    }

    let average: number = sum / length;
    return Math.round(average * 10) / 10;
  }
}

function getUserRating(ratings: RatingProps[], creator: string, newRating?: number): number {
  if (newRating === undefined || newRating === null) {
    if (ratings === null || ratings === undefined || ratings.length < 1) {
      return -1;
    }

    for (let rating of ratings) {
      if (rating.creator === creator) {
        return rating.rating;
      }
    }
    return -1;
  } else {
    return newRating;
  }
}

export { RenderStars, calcAverage, getUserRating };
