import dayjs from "dayjs";
import React from "react";
import { Link, Page, Text, View } from "@react-pdf/renderer";
import { darkColor5, primaryColor } from "../../style/cssGlobalStyle";
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
          marginBottom: 30,
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
            trip?.end_date
          ).format("DD/MM/YYYY")}`}
        />
        <TripInfo
          title="Durée"
          info={`${dayjs(trip?.end_date).diff(
            dayjs(trip?.start_date),
            "day"
          )} jours`}
        />
      </View>
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Sommaire
      </Text>
      <View style={{ width: "100%" }}>
        {daysArtifacts.map((day) => (
          <Link
            key={day.date}
            src={`#${day.date}`}
            style={{
              fontFamily: "Times-BoldItalic",
              textTransform: "uppercase",
              marginTop: 15,
              color: darkColor5,
              textDecoration: "none",
            }}
          >
            {day.date}
          </Link>
        ))}
      </View>
    </Page>
  );
}
