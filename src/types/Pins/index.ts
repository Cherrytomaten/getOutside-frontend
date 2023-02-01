export type PinProps = {
  uuid: string;
  title: string;
  description: string;
  address: string;
  openingHours: OpeningProps;
  ratings: RatingProps[];
  comments: CommentProps[];
  image: ImageProps[];
  category: string | null;
  creator: string;
  longitude: number;
  latitude: number;
  created: string;
};
