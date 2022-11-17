import * as React from 'react';
import * as pinsData from '../../data/pins.json';
type PinProps = {
  type: string;
  properties: {
    PARK_ID: 0;
    FACILITYID: 0;
    NAME: string;
    TYPE: ActivityType;
    ADDRESS: string;
    OPEN: null;
    NOTES: string;
    DESCRIPTION: string;
    PICTURE: null;
  };
  geometry: {
    type: string;
    coordinates: [];
  };
};
type ActivityType =
  | 'basketball'
  | 'skatePark'
  | 'volleyball'
  | 'spa'
  | 'parkour'
  | 'handball'
  | 'tennis'
  | 'speedball'
  | string;

const aActivities = [
  ...new Set(pinsData.features.map((activity) => activity.properties.TYPE)),
];
export default function Filters() {
  const [locationFilter, setFilter] = React.useState<ActivityType[]>([]);
  // const [pinFilter, setFilter] = React.useState<ActivityType[]>([]);
  const checkboxFilter = (activity: ActivityType) => (
    <div>
      <input
        type="checkbox"
        name={activity}
        id=""
        checked={locationFilter.includes(activity)}
        onChange={(event) => {
          const isChecked = event.target.checked;
          setFilter((currentFilter) => {
            if (isChecked) {
              return [...currentFilter, activity];
            }
            return currentFilter.filter(
              (filterActivity) => filterActivity !== activity
            );
          });
        }}
      />
      {activity}
    </div>
  );
  // how can i return pin with the matching type ????
  return (
    <div>
      <ul>
        <div>{aActivities.map(checkboxFilter)}</div>
      </ul>

      {/* <ul>
        {pinsData.features
          .filter((data) => {
            if (locationFilter.length === 0) return true;
            return locationFilter.includes(data.properties.TYPE);
          })
          .map((data) => (
            <li>{data}</li>
          ))}
      </ul> */}
    </div>
  );
}