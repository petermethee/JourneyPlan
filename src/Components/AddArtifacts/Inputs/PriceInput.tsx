import { TextField } from "@mui/material";
import React, { ChangeEvent } from "react";

export default function PriceInput({
  inputName,
  price,
  updateForm,
}: {
  inputName: string;
  price: string;
  updateForm: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <TextField
      name={inputName}
      fullWidth
      variant="standard"
      label="Prix"
      value={price}
      onChange={(event) => {
        const re = /^\d*\.?\d{0,2}$/;
        if (event.target.value === "" || re.test(event.target.value))
          updateForm(event as ChangeEvent<HTMLInputElement>);
      }}
      type="number"
      InputProps={{ inputProps: { min: 0 } }}
    />
  );
}
