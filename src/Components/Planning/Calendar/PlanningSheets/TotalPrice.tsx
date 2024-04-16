import { memo, useMemo, useState } from "react";
import { EArtifact } from "../../../../Models/EArtifacts";
import { useAppSelector } from "../../../../app/hooks";
import { selectAccomodations } from "../../../../features/Redux/accommodationsSlice";
import { selectActivities } from "../../../../features/Redux/activitiesSlice";
import { selectPlanningArtifacts } from "../../../../features/Redux/planningSlice";
import { selectTransports } from "../../../../features/Redux/transportsSlice";
import PaymentsIcon from "@mui/icons-material/Payments";
import { selectCurrentTrip } from "../../../../features/Redux/tripSlice";
import dayjs from "dayjs";
import { Button, Tooltip } from "@mui/material";
import { goldenColor, secGoldenColor } from "../../../../style/cssGlobalStyle";
import MealsPriceModal from "./MealsPriceModal";
import styles from "./TotalPrice.module.css";

function TotalPrice() {
  const trip = useAppSelector(selectCurrentTrip);
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);

  const [openModal, setOpenModal] = useState(false);

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

  return (
    <>
      <Tooltip title={tooltip}>
        <Button
          onClick={() => setOpenModal(true)}
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
      <MealsPriceModal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
}

export default memo(TotalPrice);
