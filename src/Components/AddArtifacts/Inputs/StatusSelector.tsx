import { TextField, MenuItem } from "@mui/material";
import React from "react";
import { ArtifactStatusOptions } from "../../../Models/ArtifactStatusOptions";
import { EEventStatus } from "../../../Models/EEventStatus";
import styles from "./StatusSelector.module.css";
export default function StatusSelector({
  status,
  inputName,
  updateForm,
}: {
  status: EEventStatus;
  inputName: string;
  updateForm: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <TextField
      select
      name={inputName}
      fullWidth
      variant="standard"
      label="Status"
      value={status}
      onChange={updateForm}
    >
      {Object.entries(ArtifactStatusOptions).map(([key, val]) => (
        <MenuItem key={key} value={key}>
          <div className={styles.statusContainer}>
            {val.icon()}
            <span>{val.text}</span>
          </div>
        </MenuItem>
      ))}
    </TextField>
  );
}
