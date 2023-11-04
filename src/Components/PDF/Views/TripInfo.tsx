import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import { darkColor5 } from "../../../style/cssGlobalStyle";

export default function TripInfo({
  title,
  info,
  address,
}: {
  title: string;
  info?: string | number;
  address?: { lat: number; lng: number };
}) {
  return (
    <View
      style={{
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        gap: 5,
      }}
    >
      <Text
        style={{
          textDecoration: "underline",
          color: darkColor5,
        }}
      >
        {title} :
      </Text>
      {address ? (
        <Link
          style={{ fontFamily: "Times-Italic" }}
          src={`https://www.google.com/maps/dir//${address.lat},${address.lng}`}
        >
          {info}
        </Link>
      ) : (
        <Text>{info}</Text>
      )}
    </View>
  );
}
