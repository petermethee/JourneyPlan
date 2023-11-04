import React from "react";
import { Text, View } from "@react-pdf/renderer";

export default function LeftLine({
  endTime,
  startTime,
  color,
}: {
  startTime: string;
  endTime: string;
  color: string;
}) {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        color: color,
        fontSize: 14,
        fontFamily: "Times-Bold",
      }}
    >
      <Text>{startTime}</Text>
      <View style={{ borderLeft: `1px solid ${color}`, flex: 1 }} />
      <Text>{endTime}</Text>
    </View>
  );
}
