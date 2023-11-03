import { TextField } from "@mui/material";
import React from "react";

export default function NameInput({
  inputName,
  name,
  updateForm,
}: {
  inputName: string;
  name: string;
  updateForm: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <TextField
      required
      name={inputName}
      fullWidth
      variant="standard"
      label="Titre"
      value={name}
      onChange={updateForm}
      autoFocus
    />
  );
}
