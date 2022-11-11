import RatingStar from '@/resources/svg/RatingStar';
import RatingStarFilled from '@/resources/svg/RatingStarFilled';
import RatingStarHalf from '@/resources/svg/RatingStarHalf';

function RenderStars(stars: number) {
  let finalStars: JSX.Element[] = [];
  let isDecimalNumber: boolean = false;
  let decimalNumber: number = 0;

  // if given stars are not in range -> return 5 empty stars
  if (Number.isNaN(stars) || stars < 0 || stars > 5) {
    console.error('Pin rating does not fit expected value!');
    for (let i = 1; i <= 5; i++) {
      finalStars.push(<RatingStar width="40" height="40" />);
    }
    return finalStars;
  }

  // extract decimal place if number is not an Integer
  if (!Number.isInteger(stars)) {
    decimalNumber = extractDecimalPlace(stars);
    stars = Math.floor(stars);
    isDecimalNumber = true;
  }

  // fill array with full-filled stars
  for (let i = 1; i <= stars; i++) {
    finalStars.push(<RatingStarFilled width="40" height="40" />);
  }

  // add a half star if decimal place >= 5
  if (isDecimalNumber && decimalNumber >= 5) {
    finalStars.push(<RatingStarHalf width="40" height="40" />);
  }

  // fill array with empty stars until its full
  if (finalStars.length < 5) {
    for (let i = finalStars.length; i < 5; i++) {
      finalStars.push(<RatingStar width="40" height="40" />);
    }
  }

  return finalStars;
}

function extractDecimalPlace(num: number) {
  let roundedToOneDecimalPlace: number = 0;
  let decimalNumber: number = 0;
  let cache: string = '';

  roundedToOneDecimalPlace = Math.floor(num * 10) / 10;
  cache = roundedToOneDecimalPlace.toString().split('.')[1];
  decimalNumber = Number(cache);
  return decimalNumber;
}

export default RenderStars;
