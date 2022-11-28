import RatingStar from '@/resources/svg/RatingStar';
import RatingStarFilled from '@/resources/svg/RatingStarFilled';
import RatingStarHalf from '@/resources/svg/RatingStarHalf';

function RenderStars(stars: number, width: string, height: string) {
  let finalStars: JSX.Element[] = [];
  let isDecimalNumber: boolean = false;
  let decimalNumber: number = 0;

  // if given stars are not in range -> return 5 empty stars
  if (Number.isNaN(stars) || stars < 0 || stars > 5) {
    console.error('Pin rating does not fit expected value!');
    for (let i = 1; i <= 5; i++) {
      finalStars.push(<RatingStar width={width} height={height} />);
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

export default RenderStars;
