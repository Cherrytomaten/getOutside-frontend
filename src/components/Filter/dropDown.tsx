import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks(
  checkboxes: Array<any>
  //   checkboxes: Array<[ActivityType]>
) {
  const [CategoryName, setCatecgoryName] = React.useState<string[]>([]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
        <Select
          style={{ backgroundColor: 'white' }}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={CategoryName}
          // input={<OutlinedInput label="Categories" />}
          // renderValue={(selected) => selected.join(', ')}
          // MenuProps={MenuProps}
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
