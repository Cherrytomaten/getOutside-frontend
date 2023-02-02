import { LatLngTuple } from "leaflet";

type AddPinProps = {
  title: string;
  category: string;
  address: string;
  desc: string;
  coords: LatLngTuple;
  images: FileList | null;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  }
}

export type { AddPinProps };
