import React, { useEffect, useRef, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import styles from "./AddTrip.module.css";
import { Calendar } from "primereact/calendar";
import "../style/CalendarTheme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useNavigate } from "react-router-dom";
import { routerPathes } from "../Helper/routerPathes";
import { TripsTable } from "../Models/DataBaseModel";
import { useAppDispatch } from "../app/hooks";
import { insertTrip } from "../features/Redux/JourneyPlanSlice";
import { TFormTrip, transformFormToTrip } from "../Models/ITrip";

export default function AddTrip() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<TFormTrip>({
    name: "",
    image_path: null,
    nb_travelers: 0,
    fileName: "",
  });
  const [dateRange, setDateRange] = useState<Date[] | undefined>();
  const [formValid, setFormValid] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const handleFormUpdate = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormValues((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const createTrip = () => {
    const newTrip = transformFormToTrip(formValues, dateRange as Date[]);
    dispatch(insertTrip(newTrip));
  };

  useEffect(() => {
    if (
      formValues.name !== "" &&
      formValues.image_path !== null &&
      formValues.nb_travelers > 0 &&
      dateRange &&
      dateRange.every((date) => date !== null)
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [formValues, dateRange]);

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
        <Grid item display="flex" width="60%">
          <input
            accept="image/png, image/jpeg"
            ref={inputRef}
            type="file"
            id="input-file-upload"
            multiple={false}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="input-file-upload"
            className={`${styles.labelDropZone} ${
              dragActive && styles.dragActive
            }`}
          >
            <div
              className={styles.dropHandler}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
            {formValues.image_path ? (
              <>
                <CheckRoundedIcon sx={{ fontSize: "70px" }} />
                {formValues.fileName}
              </>
            ) : (
              <>
                <CloudUploadRoundedIcon sx={{ fontSize: "70px" }} />
                Charger une image
              </>
            )}
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
            style={{ minWidth: "170px" }}
            dateFormat="dd/mm/yy"
            placeholder="Durée du voyage"
            inputClassName="input"
            value={dateRange}
            onChange={(newValue) => {
              setDateRange(newValue.value as Date[] | undefined);
            }}
            id="range"
            selectionMode="range"
            readOnlyInput
          />

          <TextField
            InputProps={{
              inputProps: {
                min: 0,
              },
            }}
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
            onChange={handleFormUpdate}
          />
        </Grid>

        <Grid item container marginTop="50px" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={() => navigate(routerPathes.home)}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            disabled={!formValid}
            onClick={createTrip}
          >
            Créer le voyage
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
