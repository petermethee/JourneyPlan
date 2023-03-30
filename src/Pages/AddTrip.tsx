import { Button, Grid, TextField } from "@mui/material";
import React from "react";

export default function AddTrip() {
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      spacing={5}
      height="100%"
    >
      <Grid item>Créer un nouveau voyage</Grid>
      <Grid item width="30rem">
        <TextField fullWidth variant="standard" label="Nom du voyage" />
      </Grid>
      <Grid item>
        <TextField fullWidth variant="standard" label="Date de début" />
        <TextField fullWidth variant="standard" label="Date de fin" />
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          variant="standard"
          type="number"
          label="Nombre de voyageur"
        />
      </Grid>
      <Grid item>
        <TextField fullWidth variant="standard" label="Localisation" />
      </Grid>
      <Grid item>
        <Button>Valider</Button>
      </Grid>
    </Grid>
  );
}
