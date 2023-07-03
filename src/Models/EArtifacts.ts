import {
  AccomodationsTable,
  ActivitiesTable,
  TablesName,
  TransportsTable,
} from "./DataBaseModel";

export enum EArtifact {
  Activity = "Activity",
  Transport = "Transport",
  Accomodation = "Accomodation",
}

export enum EArtifactTableName {
  Activity = TablesName.activities,
  Transport = TablesName.accomodations,
  Accomodation = TablesName.transports,
}

export const getArtifactTableEnum = (table: EArtifactTableName) => {
  switch (table) {
    case EArtifactTableName.Activity:
      return ActivitiesTable;
    case EArtifactTableName.Transport:
      return TransportsTable;
    default:
      return AccomodationsTable;
  }
};
