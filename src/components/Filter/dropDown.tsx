import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// type ActivityType =
//   | 'basketball'
//   | 'skatePark'
//   | 'volleyball'
//   | 'spa'
//   | 'parkour'
//   | 'handball'
//   | 'tennis'
//   | 'speedball'
//   | string;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 2;

export default function MultipleSelectCheckmarks(
  // checkboxes: Array<any>
  checkboxes: Array<{}>
) {
  const [CategoryName, setCatecgoryName] = React.useState<string[]>([]);

  return (
    <div>
      <FormControl sx={{ m: 0.5, width: 350 }}>
        <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
        <Select
          className="bg-white"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={CategoryName}
        >
          {checkboxes.map((checkbox: any) => (
            <MenuItem key={Math.random()} value={checkbox}>
              <ListItemText primary={checkbox} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
