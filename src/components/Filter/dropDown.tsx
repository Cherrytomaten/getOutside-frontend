import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';


export default function MultipleSelectCheckmarks(
  // checkboxes: Array<any>
  checkboxes: Array<{}>
) {
  const [CategoryName, setCatecgoryName] = React.useState<string[]>([]);

  return (
    <div>
      <FormControl sx={{ m: 0.5 }} className="w-screen mx-auto">
        <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
        <Select
          className="bg-white"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={CategoryName}
        >
          {checkboxes.map((checkbox: any) => (
            <MenuItem key={checkbox.PARK_ID} value={checkbox}>
              <ListItemText primary={checkbox} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
