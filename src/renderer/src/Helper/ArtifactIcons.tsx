import AccommodationIcon from "@renderer/Components/Shared/AccommodationIcon";
import ActivityIcon from "@renderer/Components/Shared/ActivityIcon";
import TransportIcon from "@renderer/Components/Shared/TransportIcon";
import { EArtifact } from "@renderer/Models/EArtifacts";

export const artifactIcons = {
  [EArtifact.Transport]: ({
    color,
    size,
  }: {
    color?: string;
    size?: "small" | "large";
  }) => <TransportIcon color={color} size={size} />,
  [EArtifact.Accommodation]: ({
    color,
    size,
  }: {
    color?: string;
    size?: "small" | "large";
  }) => <AccommodationIcon color={color} size={size} />,
  [EArtifact.Activity]: ({
    color,
    size,
  }: {
    color?: string;
    size?: "small" | "large";
  }) => <ActivityIcon color={color} size={size} />,
};
