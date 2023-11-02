import React from "react";
import { View, Text } from "@react-pdf/renderer";
import TripInfo from "./TripInfo";
import IActivity from "../../Models/IActivity";
import { TPdfArtifact } from "./PdfGenerator";

export default function ActivityPdf({
  activity,
}: {
  activity: TPdfArtifact<IActivity>;
}) {
  return (
    <View>
      <View>
        <Text>{activity.timeIndex}</Text>
        <Text>{activity.name}</Text>
        <Text>{activity.price}</Text>
        <Text> {activity.status} </Text>
      </View>
      <TripInfo title="Adresse" info={activity.location} />

      <TripInfo title="Description" info={activity.description} />
    </View>
  );
}
