import { TablesName } from "./DataBaseModel";

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
