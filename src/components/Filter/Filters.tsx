import Checkbox from './Checkbox';
import * as pinsData from '../../data/pins.json';

type pin = {
  type: '';
  properties: {
    PARK_ID: 0;
    FACILITYID: 0;
    NAME: '';
    TYPE: '';
    ADDRESS: '';
    OPEN: null;
    NOTES: '';
    DESCRIPTION: '';
    PICTURE: null;
  };
  geometry: {
    type: '';
    coordinates: [];
  };
};
// const aActivities = [pinsData.features];
// console.log('a', aActivities);
let aActivityCategories = [];
pinsData.features.forEach((pin) => {
  aActivityCategories.push(pin.properties.TYPE);
});
const setActivities = [...new Set(aActivityCategories)];
console.log(setActivities);
//   aActivityCategories.push(pin.properties.TYPE);
// });
// console.log('activities: ', aActivityCategories);
//

// displays all the checkboxes for each type of activity
export default function Filters({ getSelectedCategories }) {
  return (
    <div className="flex items-center mt-5">
      {/* {setActivities.map((activity) => {
        <Checkbox
          key={activity}
          label={activity}
          id={activity} // type = id
           getSelectedCategories={getSelectedCategories}
        />;
      })} */}
      {pinsData.features.map((pin) => (
        <Checkbox
          key={pin.properties.PARK_ID}
          label={pin.properties.TYPE}
          id={pin.properties.TYPE} // type = id
          getSelectedCategories={getSelectedCategories}
        />
      ))}
    </div>
  );
}
