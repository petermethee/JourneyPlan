import { TextField } from "@mui/material";

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
    />
  );
}
