import RatingStar from '@/resources/svg/RatingStar';
import RatingStarFilled from '@/resources/svg/RatingStarFilled';
import RatingStarHalf from '@/resources/svg/RatingStarHalf';
import { logger } from '@/util/logger';

function RenderStars(ratings: RatingProps[], width: string, height: string) {
  let finalStars: JSX.Element[] = [];
  let isDecimalNumber: boolean = false;
  let decimalNumber: number = 0;

  // return 5 empty stars if format does not match
  if (ratings === null || ratings.length < 1 || ratings === undefined) {
    logger.log('Pin rating does not fit expected value!');
    for (let i = 1; i <= 5; i++) {
      finalStars.push(<RatingStar width={width} height={height} />);
    }
    return finalStars;
  }

  // calc average rating
  let avrgRating: number = calcAverage(ratings);

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

function extractDecimalPlace(num: number) {
  const roundedToOneDecimalPlace: number = Math.floor(num * 10) / 10;
  const cache: string = roundedToOneDecimalPlace.toString().split('.')[1];

  return Number(cache);
}

function calcAverage(ratings: RatingProps[]): number {
  let sum: number = 0;

  for (let rating of ratings) {
    sum += rating.rating;
  }

  let average: number = sum / ratings.length;
  return average;
}

export default RenderStars;
