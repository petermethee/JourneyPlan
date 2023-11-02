import React from "react";
import { View, Text } from "@react-pdf/renderer";
import TripInfo from "./TripInfo";
import { TPdfArtifact } from "./PdfGenerator";
import ITransport from "../../Models/ITransport";

export default function TransportPdf({
  transport,
}: {
  transport: TPdfArtifact<ITransport>;
}) {
  return (
    <View>
      <View>
        <Text>{transport.timeIndex}</Text>
        <Text>{transport.name}</Text>
        <Text>{transport.price}</Text>
        <Text> {transport.status} </Text>
      </View>
      <TripInfo title="Adresse" info={transport.city_from ?? ""} />

      <TripInfo title="Description" info={transport.description} />
    </View>
  );
}
