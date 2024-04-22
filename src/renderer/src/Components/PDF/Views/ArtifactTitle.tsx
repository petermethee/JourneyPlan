import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { EEventStatus } from "../../../Models/EEventStatus";
import { ArtifactStatusOptions } from "../../../Helper/ArtifactStatusOptions";
export default function ArtifactTitle({
  title,
  duration,
  eventStatus,
  price,
  color,
  currency,
}: {
  title: string;
  duration?: number;
  price: number;
  eventStatus: EEventStatus;
  color: string;
  currency?: string;
}) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        fontSize: 14,
      }}
    >
      <Text style={{ fontFamily: "Times-Bold", color: color }}>{`${title} ${
        duration ? `(${duration}h) ` : ""
      }- ${price} ${currency}`}</Text>
      <Text
        style={{
          color: "#ffffff",
          borderRadius: 4,
          padding: "1px 5px",
          backgroundColor: ArtifactStatusOptions[eventStatus].color,
          fontFamily: "Times-Bold",
          fontSize: 12,
          border: `1px solid ${ArtifactStatusOptions[eventStatus].secColor}`,
        }}
      >
        {ArtifactStatusOptions[eventStatus].text}
      </Text>
    </View>
  );
}
