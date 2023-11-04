import React, { useMemo } from "react";
import { View } from "@react-pdf/renderer";
import TripInfo from "./Views/TripInfo";
import IActivity from "../../Models/IActivity";
import { TPdfArtifact } from "./PdfGenerator";
import { activityColor } from "../../style/cssGlobalStyle";
import LeftLine from "./Views/LeftLine";
import ArtifactTitle from "./Views/ArtifactTitle";

export default function ActivityPdf({
  activity,
  currency,
}: {
  activity: TPdfArtifact<IActivity>;
  currency?: string;
}) {
  const startTime = useMemo(() => {
    if (activity.timeIndex) {
      let integerPart = Math.floor(activity.timeIndex);
      let decimalPart = activity.timeIndex - integerPart;
      const hours = integerPart;
      const minutes = 60 * decimalPart;
      return `${hours}:${minutes === 0 ? "00" : minutes}`;
    }
    return "";
  }, [activity.timeIndex]);

  const endTime = useMemo(() => {
    const endTimeIndex = activity.timeIndex + activity.duration;
    let integerPart = Math.floor(endTimeIndex);
    let decimalPart = endTimeIndex - integerPart;
    const hours = integerPart;
    const minutes = 60 * decimalPart;

    return `${hours}:${minutes === 0 ? "00" : minutes}`;
  }, [activity.timeIndex, activity.duration]);
  return (
    <>
      <LeftLine startTime={startTime} endTime={endTime} color={activityColor} />
      <View style={{ width: "100%" }}>
        <ArtifactTitle
          title={activity.name}
          duration={activity.duration}
          price={activity.price}
          eventStatus={activity.status}
          currency={currency}
          color={activityColor}
        />

        <TripInfo
          title="Adresse"
          info={activity.location}
          address={
            activity.lat && activity.lng
              ? { lat: activity.lat, lng: activity.lng }
              : undefined
          }
        />
        {activity.description !== undefined && (
          <TripInfo title="Description" info={activity.description} />
        )}
        {activity.attachment.length > 0 && (
          <TripInfo
            title={"Pièces jointes"}
            info={activity.attachment.join(", ")}
          />
        )}
      </View>
    </>
  );
}
