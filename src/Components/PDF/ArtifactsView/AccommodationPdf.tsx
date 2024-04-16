import { View } from "@react-pdf/renderer";
import TripInfo from "../Views/TripInfo";
import IAccomodation from "../../../Models/IAccommodation";
import { TPdfArtifact } from "../PdfGenerator";
import { accomodationColor } from "../../../style/cssGlobalStyle";
import LeftLine from "../Views/LeftLine";
import ArtifactTitle from "../Views/ArtifactTitle";
import { useMemo } from "react";
import { meals } from "../../../Helper/MealsHelper";

export default function AccomodationPdf({
  accomodation,
  currency,
}: {
  accomodation: TPdfArtifact<IAccomodation>;
  currency?: string;
}) {
  const mealsInfo = useMemo(() => {
    const finalInfo: { title: string; info: string }[] = [];
    Object.entries(meals).forEach(([meal, data]) => {
      const text =
        accomodation[meal as keyof IAccomodation] === 1 ? "OUI" : "NON";

      finalInfo.push({ title: data.text, info: text });
    });
    return finalInfo;
  }, [accomodation]);

  return (
    <>
      <LeftLine
        startTime={accomodation.checkin}
        endTime={accomodation.checkout}
        color={accomodationColor}
      />
      <View style={{ width: "100%" }}>
        <ArtifactTitle
          title={accomodation.name}
          price={accomodation.price}
          eventStatus={accomodation.status}
          currency={currency}
          color={accomodationColor}
        />

        <TripInfo
          title="Adresse"
          info={accomodation.location}
          address={
            accomodation.lat && accomodation.lng
              ? { lat: accomodation.lat, lng: accomodation.lng }
              : undefined
          }
        />
        {mealsInfo.map((mealInfo) => (
          <TripInfo
            key={mealInfo.title}
            title={mealInfo.title}
            info={mealInfo.info}
          />
        ))}
        {accomodation.description !== undefined && (
          <TripInfo title="Description" info={accomodation.description} />
        )}
        {accomodation.attachment.length > 0 && (
          <TripInfo
            title={"Pièces jointes"}
            info={accomodation.attachment.join(", ")}
          />
        )}
      </View>
    </>
  );
}
