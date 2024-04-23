import { memo, useMemo, useState } from "react";
import { EArtifact } from "../../../../Models/EArtifacts";
import { useAppSelector } from "../../../../app/hooks";
import { selectAccommodations } from "../../../../features/Redux/accommodationsSlice";
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
  const accommodations = useAppSelector(selectAccommodations);

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

  const accommodationsAndFoodPrice = useMemo(() => {
    if (!trip) return { accommodationPrice: 0, foodPrice: 0 };
    let accommodationPrice = 0;
    const nbDays = dayjs(trip.end_date).diff(dayjs(trip.start_date), "day");
    let foodPrice =
      nbDays * trip.nb_travelers * (trip.breakfast + trip.lunch + trip.dinner);
    planningArtifacts.forEach((PA) => {
      let price: number;
      if (PA.artifactType === EArtifact.Accommodation) {
        const accommodation = accommodations.find(
          (accommodation) => accommodation.id === PA.artifactId,
        );
        price = accommodation?.price ?? 0;
        if (accommodation?.breakfast === 1) {
          foodPrice -= trip.breakfast * trip.nb_travelers;
        }
        if (accommodation?.lunch === 1) {
          foodPrice -= trip.lunch * trip.nb_travelers;
        }
        if (accommodation?.dinner === 1) {
          foodPrice -= trip.dinner * trip.nb_travelers;
        }
        accommodationPrice += price;
      }
    });
    return { accommodationPrice, foodPrice };
  }, [planningArtifacts, accommodations, trip]);

  const totalPrice = useMemo(() => {
    return (
      activitiesPrice +
      transportsPrice +
      accommodationsAndFoodPrice.accommodationPrice +
      accommodationsAndFoodPrice.foodPrice
    );
  }, [activitiesPrice, transportsPrice, accommodationsAndFoodPrice]);

  const tooltip = useMemo(() => {
    return (
      <div className={styles.tooltipContainer}>
        <div>
          <span>Activités :</span>
          <span>
            {activitiesPrice} {trip?.currency}
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
            {accommodationsAndFoodPrice.accommodationPrice} {trip?.currency}
          </span>
        </div>
        <div>
          <span>Alimentation :</span>
          <span>
            {accommodationsAndFoodPrice.foodPrice} {trip?.currency}
          </span>
        </div>
      </div>
    );
  }, [
    activitiesPrice,
    transportsPrice,
    accommodationsAndFoodPrice,
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
