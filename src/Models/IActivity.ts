import { ActivitiesTable } from "./DataBaseModel";

export default interface IActivity {
  [ActivitiesTable.id]: number;
  [ActivitiesTable.id_trip]: number;
  [ActivitiesTable.name]: string;
  [ActivitiesTable.description]: string;
  [ActivitiesTable.duration]: number;
  [ActivitiesTable.price]: number;
  [ActivitiesTable.pleasure]: number;
  [ActivitiesTable.location]: string;
  [ActivitiesTable.attachment]: string;
  [ActivitiesTable.contraint]: string;
  [ActivitiesTable.used]: boolean;
}
