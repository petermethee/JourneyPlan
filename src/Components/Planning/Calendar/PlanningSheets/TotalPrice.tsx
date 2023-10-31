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

function TotalPrice() {
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);
  const trip = useAppSelector(selectCurrentTrip);

  const totalPrice = useMemo(() => {
    let finalPrice = 0;
    let foodPriceIncluded = 0;
    planningArtifacts.forEach((PA) => {
      let price: number;
      switch (PA.artifactType) {
        case EArtifact.Activity:
          price =
            activities.find((activity) => activity.id === PA.artifactId)
              ?.price ?? 0;
          break;
        case EArtifact.Transport:
          price =
            transports.find((trasnport) => trasnport.id === PA.artifactId)
              ?.price ?? 0;
          break;
        default:
          const accomodation = accomodations.find(
            (accomodation) => accomodation.id === PA.artifactId
          );
          price = accomodation?.price ?? 0;
          break;
      }
      finalPrice += price;
    });
    return finalPrice;
  }, [planningArtifacts, activities, transports, accomodations]);

  return (
    <div className={styles.totalPrice}>
      <PaymentsIcon fontSize="small" />
      {totalPrice}€
    </div>
  );
}

export default memo(TotalPrice);
