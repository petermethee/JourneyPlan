import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Typography, TextField, Button } from "@mui/material";
import { TripsTable } from "../../../../Models/DataBaseModel";
import styles from "./TotalPrice.module.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectCurrentTrip,
  updateTrip,
} from "../../../../features/Redux/tripSlice";

export default function MealsPriceModal({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const trip = useAppSelector(selectCurrentTrip);
  const initialState = useMemo(() => {
    return {
      [TripsTable.breakfast]: trip?.breakfast ?? "",
      [TripsTable.lunch]: trip?.lunch ?? "",
      [TripsTable.dinner]: trip?.dinner ?? "",
    };
  }, [trip]);
  const [formVal, setFormVal] = useState(initialState);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newValue = value === "" ? value : parseInt(value);
    setFormVal((prevState) => {
      return { ...prevState, [event.target.name]: newValue };
    });
  };

  const handleConfirm = useCallback(() => {
    dispatch(
      updateTrip({ ...trip!, ...(formVal as { [key: string]: number }) })
    );
    setOpenModal(false);
  }, [dispatch, formVal, trip, setOpenModal]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && saveEnabled) {
        event.preventDefault();
        handleConfirm();
      }
    },
    [saveEnabled, handleConfirm]
  );

  useEffect(() => {
    setSaveEnabled(
      Object.values(formVal).every((val) => val !== "") &&
        JSON.stringify(initialState) !== JSON.stringify(formVal)
    );
  }, [formVal, initialState]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <div className={styles.modalContainer}>
        <Typography textAlign="center" variant="h6">
          Estimation des prix
        </Typography>
        <TextField
          type="number"
          onChange={handleFormChange}
          name={TripsTable.breakfast}
          value={formVal.breakfast}
          label="Petit Dej"
          variant="standard"
        />
        <TextField
          type="number"
          onChange={handleFormChange}
          name={TripsTable.lunch}
          value={formVal.lunch}
          label="Dejeuner"
          variant="standard"
        />
        <TextField
          type="number"
          onChange={handleFormChange}
          name={TripsTable.dinner}
          value={formVal.dinner}
          label="Dinner"
          variant="standard"
        />
        <div className={styles.btContainer}>
          <Button variant="outlined" onClick={() => setOpenModal(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={!saveEnabled}
          >
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
