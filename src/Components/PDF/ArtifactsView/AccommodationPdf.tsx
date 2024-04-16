import { View } from "@react-pdf/renderer";
import TripInfo from "../Views/TripInfo";
import IAccommodation from "../../../Models/IAccommodation";
import { TPdfArtifact } from "../PdfGenerator";
import { accommodationColor } from "../../../style/cssGlobalStyle";
import LeftLine from "../Views/LeftLine";
import ArtifactTitle from "../Views/ArtifactTitle";
import { useMemo } from "react";
import { meals } from "../../../Helper/MealsHelper";

export default function AccommodationPdf({
  accommodation,
  currency,
}: {
  accommodation: TPdfArtifact<IAccommodation>;
  currency?: string;
}) {
  const mealsInfo = useMemo(() => {
    const finalInfo: { title: string; info: string }[] = [];
    Object.entries(meals).forEach(([meal, data]) => {
      const text =
        accommodation[meal as keyof IAccommodation] === 1 ? "OUI" : "NON";

      finalInfo.push({ title: data.text, info: text });
    });
    return finalInfo;
  }, [accommodation]);

  return (
    <>
      <LeftLine
        startTime={accommodation.checkin}
        endTime={accommodation.checkout}
        color={accommodationColor}
      />
      <View style={{ width: "100%" }}>
        <ArtifactTitle
          title={accommodation.name}
          price={accommodation.price}
          eventStatus={accommodation.status}
          currency={currency}
          color={accommodationColor}
        />

        <TripInfo
          title="Adresse"
          info={accommodation.location}
          address={
            accommodation.lat && accommodation.lng
              ? { lat: accommodation.lat, lng: accommodation.lng }
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
        {accommodation.description !== undefined && (
          <TripInfo title="Description" info={accommodation.description} />
        )}
        {accommodation.attachment.length > 0 && (
          <TripInfo
            title={"Pièces jointes"}
            info={accommodation.attachment.join(", ")}
          />
        )}
      </View>
    </>
  );
}
