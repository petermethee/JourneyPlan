import React from "react";
import { View, Text } from "@react-pdf/renderer";
import TripInfo from "./TripInfo";
import IAccomodation from "../../Models/IAccomodation";
import { TPdfArtifact } from "./PdfGenerator";

export default function AccomodationPdf({
  accomodation,
}: {
  accomodation: TPdfArtifact<IAccomodation>;
}) {
  return (
    <View>
      <View>
        <Text>{accomodation.timeIndex}</Text>
        <Text>{accomodation.name}</Text>
        <Text>{accomodation.price}</Text>
        <Text> {accomodation.status} </Text>
      </View>
      <TripInfo title="Adresse" info={accomodation.location} />

      <TripInfo title="Description" info={accomodation.description} />
    </View>
  );
}
