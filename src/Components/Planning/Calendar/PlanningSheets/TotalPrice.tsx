import React, { memo, useMemo } from "react";
import { EArtifact } from "../../../../Models/EArtifacts";
import { useAppSelector } from "../../../../app/hooks";
import { selectAccomodations } from "../../../../features/Redux/accomodationsSlice";
import { selectActivities } from "../../../../features/Redux/activitiesSlice";
import { selectPlanningArtifacts } from "../../../../features/Redux/planningSlice";
import { selectTransports } from "../../../../features/Redux/transportsSlice";
import PaymentsIcon from "@mui/icons-material/Payments";
import styles from "./TotalPrice.module.css";
import { selectCurrentTrip } from "../../../../features/Redux/tripSlice";
import dayjs from "dayjs";

function TotalPrice() {
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);
  const trip = useAppSelector(selectCurrentTrip);

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
    let foodPriceIncluded = 0;
    planningArtifacts.forEach((PA) => {
      let price: number;
      if (PA.artifactType === EArtifact.Accomodation) {
        const accomodation = accomodations.find(
          (accomodation) => accomodation.id === PA.artifactId
        );
        price = accomodation?.price ?? 0;
        if (accomodation?.breakfast === 1) {
          foodPriceIncluded += trip?.breakfast ?? 0;
        }
        if (accomodation?.lunch === 1) {
          foodPriceIncluded += trip?.lunch ?? 0;
        }
        if (accomodation?.dinner === 1) {
          foodPriceIncluded += trip?.dinner ?? 0;
        }
        accomodationPrice += price;
      }
    });
    return { accomodationPrice, foodPriceIncluded };
  }, [planningArtifacts, accomodations, trip]);

  const totalPrice = useMemo(() => {
    let finalPrice = 0;
    if (trip) {
      const nbDays = dayjs(trip.end_date).diff(dayjs(trip.start_date), "day");
      finalPrice =
        nbDays * (trip.breakfast + trip.lunch + trip.dinner) +
        activitiesPrice +
        transportsPrice +
        accomodationsAndFoodPrice.accomodationPrice -
        accomodationsAndFoodPrice.foodPriceIncluded;
    }

    return finalPrice;
  }, [activitiesPrice, transportsPrice, accomodationsAndFoodPrice, trip]);

  return (
    <div className={styles.totalPrice}>
      <PaymentsIcon fontSize="small" />
      {totalPrice}€
    </div>
  );
}

export default memo(TotalPrice);
