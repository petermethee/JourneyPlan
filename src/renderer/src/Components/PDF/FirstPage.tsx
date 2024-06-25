import dayjs from "dayjs";

import { Link, Page, Text, View } from "@react-pdf/renderer";
import {
  darkColor1,
  darkColor5,
  primaryColor,
} from "../../style/cssGlobalStyle";
import { pageStyle } from "./PdfStyles";
import TripInfo from "./Views/TripInfo";
import ITrip from "../../Models/ITrip";
import { TDaysArtifacts } from "./PdfGenerator";

export default function FirstPage({
  trip,
  daysArtifacts,
}: {
  trip?: ITrip;
  daysArtifacts: TDaysArtifacts[];
}) {
  return (
    <Page size="A4" style={pageStyle}>
      <View
        style={{
          textAlign: "center",
          marginBottom: 20,
          fontSize: 30,
          fontFamily: "Times-Bold",
          color: primaryColor,
        }}
      >
        <Text>{trip?.name}</Text>
      </View>
      <View>
        <TripInfo title="Nombre de personnes" info={trip?.nb_travelers} />
        <TripInfo
          title="Dates"
          info={`${dayjs(trip?.start_date).format("DD/MM/YYYY")} au ${dayjs(
            trip?.end_date,
          ).format("DD/MM/YYYY")}`}
        />
        <TripInfo
          title="Durée"
          info={`${dayjs(trip?.end_date).diff(
            dayjs(trip?.start_date),
            "day",
          )} jours`}
        />
      </View>
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          margin: 20,
          fontFamily: "Times-BoldItalic",
        }}
      >
        SOMMAIRE
      </Text>
      <View style={{ width: "100%" }}>
        {daysArtifacts.map((day) => (
          <Link
            key={day.date}
            src={`#${day.date}`}
            style={{
              textTransform: "uppercase",
              color: day.artifacts.length ? darkColor1 : darkColor5,
              marginTop: 10,
            }}
          >
            {day.date}
          </Link>
        ))}
      </View>
    </Page>
  );
}
