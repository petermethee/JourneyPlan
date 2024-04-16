import { Page, Text, View, Document } from "@react-pdf/renderer";
import { TDaysArtifacts, TPdfArtifact } from "./PdfGenerator";
import ITrip from "../../Models/ITrip";
import { darkColor2, primaryColor } from "../../style/cssGlobalStyle";
import { pageStyle } from "./PdfStyles";
import ActivityPdf from "./ArtifactsView/ActivityPdf";
import { EArtifact } from "../../Models/EArtifacts";
import IActivity from "../../Models/IActivity";
import TransportPdf from "./ArtifactsView/TransportPdf";
import ITransport from "../../Models/ITransport";
import AccommodationPdf from "./ArtifactsView/AccommodationPdf";
import IAccommodation from "../../Models/IAccommodation";
import { Style } from "@react-pdf/types";
import FirstPage from "./FirstPage";

const cardStyle: Style = {
  marginTop: 25,
  paddingBottom: 25,
  borderBottom: `1px solid ${primaryColor}`,
  display: "flex",
  flexDirection: "row",
  width: "100%",
  gap: 10,
};

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
        fontSize: 12,
        color: darkColor2,
        fontFamily: "Times-Roman",
      }}
      title={trip?.name}
    >
      <FirstPage trip={trip} daysArtifacts={daysArtifacts} />
      {daysArtifacts
        .filter((page) => page.artifacts.length > 0)
        .map((dayArtifacts) => (
          <Page key={dayArtifacts.date} style={pageStyle}>
            <View style={{ textAlign: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  color: primaryColor,
                  textTransform: "uppercase",
                  fontFamily: "Times-Bold",
                }}
                id={dayArtifacts.date}
              >
                {dayArtifacts.date}
              </Text>
            </View>
            {dayArtifacts.artifacts.map((dataPdf, index) => {
              if (dataPdf.type === EArtifact.Activity) {
                return (
                  <View key={index} style={cardStyle}>
                    <ActivityPdf
                      activity={dataPdf.pdfArtifact as TPdfArtifact<IActivity>}
                      currency={trip?.currency}
                    />
                  </View>
                );
              } else if (dataPdf.type === EArtifact.Transport) {
                return (
                  <View key={index} style={cardStyle}>
                    <TransportPdf
                      transport={
                        dataPdf.pdfArtifact as TPdfArtifact<ITransport>
                      }
                      currency={trip?.currency}
                    />
                  </View>
                );
              } else {
                return (
                  <View key={index} style={cardStyle}>
                    <AccommodationPdf
                      accommodation={
                        dataPdf.pdfArtifact as TPdfArtifact<IAccommodation>
                      }
                      currency={trip?.currency}
                    />
                  </View>
                );
              }
            })}
          </Page>
        ))}
    </Document>
  );
}
