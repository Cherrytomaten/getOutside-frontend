type MapPointProps = {
  uuid: string;
  title: string;
  description: string;
  address: string;
  openingHours: OpeningProps;
  rating: number;
  comments: CommentProps[];
  image: ImageProps;
};
