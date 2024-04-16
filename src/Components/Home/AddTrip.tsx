import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import styles from "./AddTrip.module.css";
import { Calendar } from "primereact/calendar";
import "../../style/CalendarTheme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "../../Helper/ERouterPathes";
import { TripsTable } from "../../Models/DataBaseModel";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  insertTrip,
  selectCurrentTrip,
  updateTrip,
} from "../../features/Redux/tripSlice";
import { TFormTrip, transformFormToTrip } from "../../Models/ITrip";
import IAttachment from "../../Models/IAttachment";
import dayjs from "dayjs";

export default function AddTrip() {
  const trip = useAppSelector(selectCurrentTrip);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues = useMemo(() => {
    if (trip) {
      return {
        name: trip.name,
        nb_travelers: trip.nb_travelers,
        image_path: trip.image_path,
        fileName: "Image déjà chargée",
        currency: trip.currency,
      };
    } else {
      return {
        name: "",
        image_path: null,
        nb_travelers: 1,
        fileName: "",
        currency: "€",
      };
    }
  }, [trip]);

  const initDateRange = useMemo(() => {
    if (trip) {
      return [new Date(trip.start_date), new Date(trip.end_date)];
    } else {
      return undefined;
    }
  }, [trip]);
  const [formValues, setFormValues] = useState<TFormTrip>(initialValues);
  const [dateRange, setDateRange] = useState<Date[] | undefined>(initDateRange);
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
      const image = e.dataTransfer.files[0] as unknown as IAttachment;
      setFormValues((prevState) => {
        return { ...prevState, image_path: image.path, fileName: image.name };
      });
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0] as unknown as IAttachment;
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
    setFormValid(false);
    const newTrip = transformFormToTrip(
      formValues,
      [
        dayjs(dateRange![0]).format("YYYY-MM-DD"),
        dayjs(dateRange![1]).format("YYYY-MM-DD"),
      ],
      trip?.id
    );
    if (trip) {
      dispatch(updateTrip(newTrip))
        .unwrap()
        .then(() => navigate(ERouterPaths.home));
    } else {
      dispatch(insertTrip(newTrip))
        .unwrap()
        .then(() => navigate(ERouterPaths.home));
    }
  };

  useEffect(() => {
    if (
      formValues.name !== "" &&
      formValues.nb_travelers > 0 &&
      formValues.currency !== "" &&
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
      <span className={styles.title}>Créer un voyage</span>
      <Grid
        container
        width="80%"
        direction="column"
        alignItems="center"
        rowSpacing={5}
        paddingTop="50px"
      >
        <Grid item display="flex" alignItems="end" width="100%">
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
        <Grid item container justifyContent="space-between" alignItems="center">
          <Grid item display="flex" xs={6} justifyContent="center">
            <Calendar
              inline
              dateFormat="dd/mm/yy"
              inputClassName="input"
              value={dateRange}
              onChange={(newValue) => {
                setDateRange(newValue.value as Date[] | undefined);
              }}
              id="range"
              selectionMode="range"
            />
          </Grid>
          <Grid
            container
            item
            flexDirection="column"
            xs={6}
            height="100%"
            justifyContent="space-evenly"
            paddingLeft="20px"
          >
            <Grid item display="flex" justifyContent="space-between">
              <TextField
                InputProps={{
                  style: { fontSize: "20px" },
                  inputProps: {
                    min: 1,
                  },
                }}
                InputLabelProps={{ style: { fontSize: "15px" } }}
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
              <TextField
                InputProps={{
                  style: { fontSize: "20px" },
                }}
                inputProps={{ maxLength: 3 }}
                InputLabelProps={{ style: { fontSize: "15px" } }}
                variant="standard"
                label="Devise"
                name={TripsTable.currency}
                value={formValues.currency}
                sx={{
                  height: "100%",
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                }}
                onChange={handleFormUpdate}
              />
            </Grid>
            <Grid item>
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
                    choisir une image de fond
                  </>
                )}
              </label>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container marginTop="25px" justifyContent="space-evenly">
          <Button
            variant="outlined"
            onClick={() => navigate(ERouterPaths.home)}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            disabled={!formValid}
            onClick={createTrip}
          >
            {trip ? "Modifier le voyage" : "Créer le voyage"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
