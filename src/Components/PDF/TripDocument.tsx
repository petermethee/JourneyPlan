import { Page, Text, View, Document } from "@react-pdf/renderer";
import { TDaysArtifacts } from "./PdfGenerator";
import ITrip from "../../Models/ITrip";
import dayjs from "dayjs";

export default function TripDocument({
  trip,
  daysArtifacts,
}: {
  trip?: ITrip;
  daysArtifacts: TDaysArtifacts[];
}) {
  return (
    <Document>
      <Page size="A5" orientation="landscape">
        <View style={{ textAlign: "center", margin: 30 }}>
          <Text>{trip?.name}</Text>
        </View>
        <View>
          <Text>Nombre de personnes: {trip?.nb_travelers}</Text>
          <Text>
            Dates: {dayjs(trip?.start_date).format("DD MM YYYY")} -{" "}
            {dayjs(trip?.end_date).format("DD MM YYYY")}
          </Text>
          <Text>
            Durée: {dayjs(trip?.end_date).diff(dayjs(trip?.start_date), "day")}{" "}
            jours
          </Text>
        </View>
      </Page>
      {daysArtifacts.map((dayArtifacts) => (
        <Page size="A5" orientation="landscape">
          <View style={{ textAlign: "center", margin: 30 }}>
            <Text>{dayArtifacts.date}</Text>
          </View>
          {dayArtifacts.artifacts.map((artifact) => (
            <View>
              <Text>{artifact.name}</Text>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
}
