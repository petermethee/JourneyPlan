import { Page, Text, View, Document } from "@react-pdf/renderer";
import { TDaysArtifacts, TPdfArtifact } from "./PdfGenerator";
import ITrip from "../../Models/ITrip";
import dayjs from "dayjs";
import {
  darkColor2,
  darkColor5,
  primaryColor,
} from "../../style/cssGlobalStyle";
import TripInfo from "./TripInfo";
import { pageStyle } from "./PdfStyles";
import ActivityPdf from "./ActivityPdf";
import { EArtifact } from "../../Models/EArtifacts";
import IActivity from "../../Models/IActivity";
import TransportPdf from "./TransportPdf";
import ITransport from "../../Models/ITransport";
import AccomodationPdf from "./AccomodationPdf";
import IAccomodation from "../../Models/IAccomodation";

export default function TripDocument({
  trip,
  daysArtifacts,
}: {
  trip?: ITrip;
  daysArtifacts: TDaysArtifacts[];
}) {
  return (
    <Document
      style={{
        fontSize: 14,
        color: darkColor2,
      }}
    >
      <Page size="A4" style={pageStyle}>
        <View style={{ textAlign: "center", marginBottom: 30, fontSize: 30 }}>
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
      </Page>
      {daysArtifacts.map((dayArtifacts) => (
        <Page style={pageStyle}>
          <View style={{ textAlign: "center" }}>
            <Text
              style={{
                fontSize: 18,
                color: primaryColor,
                textTransform: "uppercase",
              }}
            >
              {dayArtifacts.date}
            </Text>
          </View>
          {dayArtifacts.artifacts.map((dataPdf, index) => {
            if (dataPdf.type === EArtifact.Activity) {
              return (
                <ActivityPdf
                  key={index}
                  activity={dataPdf.pdfArtifact as TPdfArtifact<IActivity>}
                />
              );
            } else if (dataPdf.type === EArtifact.Transport) {
              return (
                <TransportPdf
                  key={index}
                  transport={dataPdf.pdfArtifact as TPdfArtifact<ITransport>}
                />
              );
            } else {
              return (
                <AccomodationPdf
                  key={index}
                  accomodation={
                    dataPdf.pdfArtifact as TPdfArtifact<IAccomodation>
                  }
                />
              );
            }
          })}
        </Page>
      ))}
    </Document>
  );
}
