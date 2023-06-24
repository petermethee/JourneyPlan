import { Grid, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TFormActivity } from "../../Models/IActivity";
import { ActivitiesTable } from "../../Models/DataBaseModel";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./AddActivity.module.css";

export default function AddActivity() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [formValues, setFormValues] = useState<TFormActivity>({
    [ActivitiesTable.name]: "",
    [ActivitiesTable.description]: "",
    [ActivitiesTable.duration]: 0,
    [ActivitiesTable.price]: 0,
    [ActivitiesTable.pleasure]: 0,
    [ActivitiesTable.location]: "",
    [ActivitiesTable.attachment]: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState(0);
  const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormValues((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // handle drag events
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const image = e.dataTransfer.files[0] as unknown as {
        path: string;
        name: string;
      };
      setFormValues((prevState) => {
        return { ...prevState, image_path: image.path, fileName: image.name };
      });
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0] as unknown as {
        path: string;
        name: string;
      };
      setFormValues((prevState) => {
        return { ...prevState, image_path: image.path, fileName: image.name };
      });
    }
  };

  const isHourValid = useMemo(() => {
    const hourNum = parseInt(hours);
    if (isNaN(hourNum)) {
      return false;
    } else if (hourNum < 0 || hourNum > 23) {
      return false;
    }
    return true;
  }, [hours]);

  return (
    <Grid container spacing={4} padding={4}>
      <Grid item xs={9}>
        <TextField
          name={ActivitiesTable.name}
          fullWidth
          variant="standard"
          label="Titre"
          value={formValues.name}
          onChange={updateForm}
        />
      </Grid>

      <Grid item xs={3}>
        <TextField
          name={ActivitiesTable.price}
          fullWidth
          variant="standard"
          label="Prix"
          value={formValues.price}
          onChange={updateForm}
          type="number"
        />
      </Grid>
      <Grid item xs={9}>
        <TextField
          name={ActivitiesTable.location}
          fullWidth
          variant="standard"
          label="Localisation"
          value={formValues.location}
          onChange={updateForm}
        />
      </Grid>
      <Grid item xs={3} flexWrap="nowrap" display="flex" gap={1}>
        <TextField
          fullWidth
          variant="standard"
          label="H"
          value={hours}
          type="number"
          InputProps={{ inputProps: { min: 0, max: 23 } }}
          onChange={(event) => setHours(event.target.value)}
          error={!isHourValid}
        />
        <TextField
          select
          fullWidth
          variant="standard"
          label="MIN"
          value={minutes}
          type="number"
          onChange={(event) => setMinutes(parseInt(event.target.value))}
        >
          {[0, 15, 30, 45].map((minute, index) => (
            <MenuItem key={minute} value={index}>
              {minute}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name={ActivitiesTable.description}
          fullWidth
          variant="standard"
          label="Notes"
          value={formValues.description}
          onChange={updateForm}
          multiline
          sx={{ height: "100%" }}
        />
      </Grid>
      <Grid item xs={12}>
        PJ
      </Grid>
      <input
        accept="image/png, image/jpeg, "
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <label
        htmlFor="input-file-upload"
        className={`${styles.labelDropZone} ${dragActive && styles.dragActive}`}
      >
        <div
          className={styles.dropHandler}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
        {dragActive && (
          <div className={styles.dropLabel}>
            <DownloadIcon />
            Lâcher le document ici
          </div>
        )}
      </label>
    </Grid>
  );
}
