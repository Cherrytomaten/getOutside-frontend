import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ActivityType } from "@/types/Pins/ActivityType";
import { Checkbox, ListItemText } from "@mui/material";

type DropdownProps = {
    checkboxList: string[];
    locationFilter: ActivityType[];
    setLocFilter: Dispatch<SetStateAction<string[]>>;
}

function DropdownMenu({ checkboxList, locationFilter, setLocFilter }: DropdownProps) {
    function changeHandler(event: ChangeEvent<HTMLInputElement>) {
        const { target: { value } } = event;

        if (event.target.checked) {
            if (!locationFilter.includes(value)) {
                setLocFilter([...locationFilter, value]);
            }
        } else {
            if (locationFilter.includes(value)) {
                setLocFilter(locationFilter.filter(elem => elem !== value));
            }
        }
    }

    return (
        <div>
            <FormControl sx={{m: 0.5}} className="w-screen mx-auto">
                <InputLabel
                    className="w-screen mx-auto"
                    style={{color: 'dimgrey'}}
                    id="demo-multiple-checkbox-label"
                >Categories</InputLabel>
                <Select
                    className="bg-bright-seaweed"
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={[]}>

                    {checkboxList.map((activity: string) =>
                        <MenuItem key={activity} value={activity}>
                            <Checkbox
                                onChange={changeHandler}
                                checked={locationFilter.includes(activity)}
                                value={activity}
                            />
                            <ListItemText primary={activity} />
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        </div>
    );
}

export { DropdownMenu };
