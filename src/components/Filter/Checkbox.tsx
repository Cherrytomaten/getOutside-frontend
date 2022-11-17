// import * as React from 'react';
// import * as pinsData from '../../data/pins.json';
// export default function Checkbox({ label }) {
//   type Pin = {
//     type: string;
//     properties: {
//       PARK_ID: 0;
//       FACILITYID: 0;
//       NAME: string;
//       TYPE: ACTIVITYTYPE;
//       ADDRESS: string;
//       OPEN: null;
//       NOTES: string;
//       DESCRIPTION: string;
//       PICTURE: null;
//     };
//     geometry: {
//       type: string;
//       coordinates: [];
//     };
//   };
//   let aActivityCategories: string[] = [];
//   pinsData.features.forEach((pin) => {
//     aActivityCategories.push(pin.properties.TYPE);
//   });
//   const aActivities = [...new Set(aActivityCategories)];
//   type ACTIVITYTYPE =
//     | 'basketball'
//     | 'skatePark'
//     | 'volleyball'
//     | 'spa'
//     | 'parkour'
//     | 'handball'
//     | 'tennis'
//     | 'speedball';

//   const [locationFilter, setFilter] = React.useState<Pin[]>([]);
//   return (
//     <label className="inline-flex items-center mt-3 mr-3">
//       <input
//         type="checkbox"
//         name={label}
//         id=""
//         // checked={locationFilter.includes(label)}
//         onChange={(event) => {
//           const isChecked = event.target.checked;
//           console.log('event', isChecked);
//           console.log('filter', locationFilter);
//           setFilter((currentFilter) => {
//             console.log(currentFilter);
//             if (isChecked) {
//               return [...currentFilter, label];
//             }
//             return currentFilter.filter(
//               (filterLocation) => filterLocation !== label
//             );
//           });
//         }}
//       />
//       <span className="ml-2 text-white-700">{label}</span>
//     </label>
//   );
// }
