import React, { useRef, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import styles from "./AddTrip.module.css";
import Trip, { TripsTable } from "../Models/Trips";
import { Calendar } from "primereact/calendar";
import "../style/CalendarTheme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

type TFormTrip = {
  [TripsTable.name]: string;
  [TripsTable.nbTravelers]: number;
  [TripsTable.imagePath]: string;
};
export default function AddTrip() {
  const [formValues, setFormValues] = useState<TFormTrip>({
    name: "",
    image_path: "",
    nb_travelers: 0,
  });

  const [dragActive, setDragActive] = useState(false);
  const [dateRange, setDateRange] = useState<
    Date | Date[] | undefined | null | string
  >();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // handle drag events
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.type);

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      //handleFile(e.dataTransfer.files);
      console.log(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current!.click();
  };

  const handleFormUpdate = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormValues((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  return (
    <div className={styles.container}>
      <Grid
        container
        width="60%"
        direction="column"
        alignItems="center"
        rowSpacing={5}
      >
        <Grid
          item
          height="30vh"
          marginBottom="50px"
          display="flex"
          alignItems="end"
          width="100%"
        >
          <TextField
            fullWidth
            variant="standard"
            label="Nom du voyage"
            inputProps={{ style: { fontSize: "30px", textAlign: "center" } }}
            InputLabelProps={{ style: { fontSize: "30px" } }}
            onChange={handleFormUpdate}
            name={TripsTable.name}
            value={formValues.name}
          />
        </Grid>
        <Grid item>
          <input
            accept="image/png, image/jpeg"
            ref={inputRef}
            type="file"
            id="input-file-upload"
            multiple={false}
            onChange={handleFormUpdate}
            style={{ display: "none" }}
          />
          <label
            htmlFor="input-file-upload"
            className={`${styles.labelDropZone} ${
              dragActive && styles.dragActive
            }`}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <p>Drag and drop your file here or</p>
              <button className={styles.uploadBt} onClick={onButtonClick}>
                Upload a file
              </button>
            </div>
          </label>
        </Grid>
        <Grid
          item
          display="flex"
          width="100%"
          justifyContent="space-around"
          alignItems="center"
        >
          <Calendar
            dateFormat="dd/mm/yy"
            placeholder="Durée du voyage"
            inputClassName="input"
            value={dateRange}
            onChange={(newValue) => {
              setDateRange(newValue.value);
            }}
            id="range"
            selectionMode="range"
            readOnlyInput
            baseZIndex={1102}
          />

          <TextField
            variant="standard"
            type="number"
            label="Nombre de voyageur"
            name={TripsTable.nbTravelers}
            value={formValues.nb_travelers}
            sx={{
              height: "100%",
              "& .MuiInputBase-root": {
                height: "100%",
              },
            }}
          />
        </Grid>

        <Grid item container marginTop="50px" justifyContent="space-between">
          <Button variant="outlined">Annuler</Button>
          <Button variant="contained">Créer le voyage</Button>
        </Grid>
      </Grid>
    </div>
  );
}
