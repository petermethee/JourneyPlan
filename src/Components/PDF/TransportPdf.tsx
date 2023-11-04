import React, { useMemo } from "react";
import { View } from "@react-pdf/renderer";
import TripInfo from "./Views/TripInfo";
import ITransport from "../../Models/ITransport";
import { TPdfArtifact } from "./PdfGenerator";
import { transportColor } from "../../style/cssGlobalStyle";
import LeftLine from "./Views/LeftLine";
import ArtifactTitle from "./Views/ArtifactTitle";

export default function TransportPdf({
  transport,
  currency,
}: {
  transport: TPdfArtifact<ITransport>;
  currency?: string;
}) {
  const startTime = useMemo(() => {
    if (transport.timeIndex) {
      let integerPart = Math.floor(transport.timeIndex);
      let decimalPart = transport.timeIndex - integerPart;
      const hours = integerPart;
      const minutes = 60 * decimalPart;
      return `${hours}:${minutes === 0 ? "00" : minutes}`;
    }
    return "";
  }, [transport.timeIndex]);

  const endTime = useMemo(() => {
    const endTimeIndex = transport.timeIndex + transport.duration;
    let integerPart = Math.floor(endTimeIndex);
    let decimalPart = endTimeIndex - integerPart;
    const hours = integerPart;
    const minutes = 60 * decimalPart;

    return `${hours}:${minutes === 0 ? "00" : minutes}`;
  }, [transport.timeIndex, transport.duration]);
  return (
    <>
      <LeftLine
        startTime={startTime}
        endTime={endTime}
        color={transportColor}
      />
      <View style={{ width: "100%" }}>
        <ArtifactTitle
          title={transport.name}
          duration={transport.duration}
          price={transport.price}
          eventStatus={transport.status}
          currency={currency}
          color={transportColor}
        />

        <TripInfo
          title="Départ"
          info={transport.departure}
          address={
            transport.lat_from && transport.lng_from
              ? { lat: transport.lat_from, lng: transport.lng_from }
              : undefined
          }
        />
        <TripInfo
          title="Arrivé"
          info={transport.destination}
          address={
            transport.lat_to && transport.lng_to
              ? { lat: transport.lat_to, lng: transport.lng_to }
              : undefined
          }
        />
        {transport.description !== undefined && (
          <TripInfo title="Description" info={transport.description} />
        )}
        {transport.attachment.length > 0 && (
          <TripInfo
            title={"Pièces jointes"}
            info={transport.attachment.join(", ")}
          />
        )}
      </View>
    </>
  );
}
