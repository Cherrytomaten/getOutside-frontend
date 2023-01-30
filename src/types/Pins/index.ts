export type PinProps = MapPointProps & {
  category: string | null;
  creator: string;
  longitude: number;
  latitude: number;
  notes: string | null;
  created: string;
};
