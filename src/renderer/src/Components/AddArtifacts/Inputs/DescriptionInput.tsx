import { TextField } from "@mui/material";
import React from "react";

export default function DescriptionInput({
  inputName,
  description,
  updateForm,
}: {
  inputName: string;
  description?: string;
  updateForm: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <TextField
      name={inputName}
      fullWidth
      variant="standard"
      label="Notes"
      value={description ?? ""}
      onChange={updateForm}
      multiline
      inputProps={{ style: { backgroundColor: "#00000010" } }}
    />
  );
}
