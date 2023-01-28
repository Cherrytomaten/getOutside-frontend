// export type PinProps = {
//   type: string;
//   properties: {
//     PARK_ID: number;
//     FACILITYID: number;
//     NAME: string;
//     TYPE: string;
//     ADDRESS: string;
//     OPEN: null;
//     NOTES: string;
//     DESCRIPTION: string;
//     PICTURE: null;
//   };
//   geometry: {
//     type: string;
//     coordinates: number[];
//   };
// };

export type PinProps = MapPointProps & {
  category: string | null;
  creator_id: any | null;
  longitude: number;
  latitude: number;
  notes: string | null;
  created: string;
};
