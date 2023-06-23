import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { TFormActivity } from "../../Models/IActivity";
import { ActivitiesTable } from "../../Models/DataBaseModel";

export default function AddActivity() {
  const [formValues, setFormValues] = useState<TFormActivity>({
    [ActivitiesTable.name]: "",
    [ActivitiesTable.description]: "",
    [ActivitiesTable.duration]: 0,
    [ActivitiesTable.price]: 0,
    [ActivitiesTable.pleasure]: 0,
    [ActivitiesTable.location]: "",
    [ActivitiesTable.attachment]: "",
  });

  const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormValues((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          variant="standard"
          label="Nom"
          value={formValues.name}
          onChange={updateForm}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          variant="standard"
          label="Durée"
          value={formValues.duration}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          variant="standard"
          label="Prix"
          value={formValues.price}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="standard"
          label="Description"
          value={formValues.description}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="standard"
          label="Localisation"
          value={formValues.location}
        />
      </Grid>
    </Grid>
  );
}
