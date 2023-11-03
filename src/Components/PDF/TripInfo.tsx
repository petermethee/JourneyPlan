import React from "react";
import { View, Text } from "@react-pdf/renderer";

export default function TripInfo({
  title,
  info,
}: {
  title: string;
  info?: string | number;
}) {
  return (
    <View
      style={{
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        gap: 3,
      }}
    >
      <Text
        style={{
          textDecoration: "underline",
          color: "#000",
        }}
      >
        {title}
      </Text>
      <Text>: {info}</Text>
    </View>
  );
}