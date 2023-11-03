import { TextField, MenuItem } from "@mui/material";
import React from "react";

export default function TimeInput({
  hours,
  minutes,
  setHours,
  setMinutes,
}: {
  hours: string;
  minutes: number;
  setHours: (hour: string) => void;
  setMinutes: (hour: number) => void;
}) {
  return (
    <>
      <TextField
        fullWidth
        variant="standard"
        label="H"
        value={hours}
        type="number"
        InputProps={{ inputProps: { min: 0, max: 23 } }}
        onChange={(event) => setHours(event.target.value)}
        error={false}
      />
      <TextField
        select
        fullWidth
        variant="standard"
        label="MIN"
        value={minutes}
        onChange={(event) => setMinutes(parseInt(event.target.value))}
        error={false}
        sx={{ "& .MuiSelect-select": { fontSize: "1.3rem" } }}
      >
        {["00", 15, 30, 45].map((minute, index) => (
          <MenuItem key={minute} value={index}>
            {minute}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
