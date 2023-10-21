import { Marker, Popup } from "react-leaflet";
import AccomodationMarker from "../../../assets/AccomodationMarker";
import { EArtifact } from "../../../Models/EArtifacts";
import { useMemo } from "react";

export default function CustomMarker({
  position,
  artifactType,
  value,
  onClick,
  onHover,
  description,
  selected,
}: {
  position: [number, number];
  value: number;
  artifactType: EArtifact;
  onClick: () => void;
  onHover: (isHovered: boolean) => void;
  description?: string;
  selected?: boolean;
}) {
  const icon = useMemo(() => {
    return AccomodationMarker(value, selected);
  }, [value, selected]);

  return (
    <Marker
      riseOnHover
      riseOffset={10}
      position={position}
      icon={icon}
      eventHandlers={{
        click: onClick,
        mouseover: () => onHover(true),
        mouseout: () => onHover(false),
      }}
    >
      {description && <Popup>{description}</Popup>}
    </Marker>
  );
}
