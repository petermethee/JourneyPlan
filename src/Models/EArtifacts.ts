import {
  AccommodationsTable,
  ActivitiesTable,
  TablesName,
  TransportsTable,
} from "./DataBaseModel";

export enum EArtifact {
  Activity = "Activity",
  Transport = "Transport",
  Accommodation = "Accommodation",
}

export enum EArtifactTableName {
  Activity = TablesName.activities,
  Transport = TablesName.transports,
  Accommodation = TablesName.accommodations,
}

export const getArtifactTableEnum = (table: EArtifactTableName) => {
  switch (table) {
    case EArtifactTableName.Activity:
      return ActivitiesTable;
    case EArtifactTableName.Transport:
      return TransportsTable;
    default:
      return AccommodationsTable;
  }
};
