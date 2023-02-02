type MapPointProps = {
  uuid: string;
  title: string;
  description: string;
  address: string;
  openingHours: OpeningProps;
  ratings: RatingProps[];
  comments: CommentProps[];
  image: ImageProps;
};
