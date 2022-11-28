function RatingStarFilled({ width, height }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={width}
      height={height}
      className="inline"
      fill="#ffe000"
    >
      <path d="m11.65 44 4.65-15.2L4 20h15.2L24 4l4.8 16H44l-12.3 8.8L36.35 44 24 34.6Z" />
    </svg>
  );
}

export default RatingStarFilled;
