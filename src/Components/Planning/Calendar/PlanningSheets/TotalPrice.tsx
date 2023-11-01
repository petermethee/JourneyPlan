import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { EArtifact } from "../../../../Models/EArtifacts";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectAccomodations } from "../../../../features/Redux/accomodationsSlice";
import { selectActivities } from "../../../../features/Redux/activitiesSlice";
import { selectPlanningArtifacts } from "../../../../features/Redux/planningSlice";
import { selectTransports } from "../../../../features/Redux/transportsSlice";
import PaymentsIcon from "@mui/icons-material/Payments";
import styles from "./TotalPrice.module.css";
import {
  selectCurrentTrip,
  updateTrip,
} from "../../../../features/Redux/tripSlice";
import dayjs from "dayjs";
import { Button, Modal, TextField, Tooltip, Typography } from "@mui/material";
import { goldenColor, secGoldenColor } from "../../../../style/cssGlobalStyle";
import { TripsTable } from "../../../../Models/DataBaseModel";

function TotalPrice() {
  const dispatch = useAppDispatch();
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);
  const trip = useAppSelector(selectCurrentTrip);

  const initialState = useMemo(() => {
    return {
      [TripsTable.breakfast]: trip?.breakfast ?? "",
      [TripsTable.lunch]: trip?.lunch ?? "",
      [TripsTable.dinner]: trip?.dinner ?? "",
    };
  }, [trip]);

  const [open, setOpen] = useState(false);
  const [formVal, setFormVal] = useState(initialState);
  const [saveEnabled, setSaveEnabled] = useState(false);

  const activitiesPrice = useMemo(() => {
    let finalPrice = 0;
    planningArtifacts.forEach((PA) => {
      let price: number;
      if (PA.artifactType === EArtifact.Activity) {
        price =
          activities.find((activity) => activity.id === PA.artifactId)?.price ??
          0;
        finalPrice += price;
      }
    });
    return finalPrice;
  }, [planningArtifacts, activities]);

  const transportsPrice = useMemo(() => {
    let finalPrice = 0;
    planningArtifacts.forEach((PA) => {
      let price: number;
      if (PA.artifactType === EArtifact.Transport) {
        price =
          transports.find((transport) => transport.id === PA.artifactId)
            ?.price ?? 0;
        finalPrice += price;
      }
    });
    return finalPrice;
  }, [planningArtifacts, transports]);

  const accomodationsAndFoodPrice = useMemo(() => {
    let accomodationPrice = 0;
    const nbDays = dayjs(trip?.end_date).diff(dayjs(trip?.start_date), "day");
    let foodPrice =
      nbDays *
      ((trip?.breakfast ?? 0) + (trip?.lunch ?? 0) + (trip?.dinner ?? 0));
    planningArtifacts.forEach((PA) => {
      let price: number;
      if (PA.artifactType === EArtifact.Accomodation) {
        const accomodation = accomodations.find(
          (accomodation) => accomodation.id === PA.artifactId
        );
        price = accomodation?.price ?? 0;
        if (accomodation?.breakfast === 1) {
          foodPrice -= trip?.breakfast ?? 0;
        }
        if (accomodation?.lunch === 1) {
          foodPrice -= trip?.lunch ?? 0;
        }
        if (accomodation?.dinner === 1) {
          foodPrice -= trip?.dinner ?? 0;
        }
        accomodationPrice += price;
      }
    });
    return { accomodationPrice, foodPrice };
  }, [planningArtifacts, accomodations, trip]);

  const totalPrice = useMemo(() => {
    return (
      activitiesPrice +
      transportsPrice +
      accomodationsAndFoodPrice.accomodationPrice +
      accomodationsAndFoodPrice.foodPrice
    );
  }, [activitiesPrice, transportsPrice, accomodationsAndFoodPrice]);

  const tooltip = useMemo(() => {
    return (
      <div className={styles.tooltipContainer}>
        <div>
          <span>Activités :</span>
          <span>
            {activitiesPrice} {trip?.currency}{" "}
          </span>
        </div>
        <div>
          <span>Transport :</span>
          <span>
            {transportsPrice} {trip?.currency}
          </span>
        </div>
        <div>
          <span>Hébergement :</span>
          <span>
            {accomodationsAndFoodPrice.accomodationPrice} {trip?.currency}
          </span>
        </div>
        <div>
          <span>Alimentation :</span>
          <span>
            {accomodationsAndFoodPrice.foodPrice} {trip?.currency}
          </span>
        </div>
      </div>
    );
  }, [
    activitiesPrice,
    transportsPrice,
    accomodationsAndFoodPrice,
    trip?.currency,
  ]);

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
    setOpen(false);
  }, [dispatch, formVal, trip, setOpen]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && saveEnabled) {
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
    <>
      <Tooltip title={tooltip}>
        <Button
          onClick={() => setOpen(true)}
          startIcon={<PaymentsIcon fontSize="small" />}
          sx={{
            backgroundColor: goldenColor,
            color: "white",
            margin: "5px",
            fontWeight: "bold",
            fontSize: "20px",
            gap: "5px",
            "&:hover": {
              backgroundColor: secGoldenColor,
            },
          }}
        >
          {totalPrice} {trip?.currency}
        </Button>
      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)}>
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
            <Button variant="outlined" onClick={() => setOpen(false)}>
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
    </>
  );
}

export default memo(TotalPrice);
