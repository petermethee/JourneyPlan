import { ActivitiesTable } from "./DataBaseModel";
import IAttachment from "./IAttachment";

export default interface IActivity {
  [ActivitiesTable.id]: number;
  [ActivitiesTable.id_trip]: number;
  [ActivitiesTable.name]: string;
  [ActivitiesTable.description]?: string;
  [ActivitiesTable.duration]: number;
  [ActivitiesTable.price]: number;
  [ActivitiesTable.pleasure]?: number;
  [ActivitiesTable.location]: string;
  [ActivitiesTable.contraint]?: string;
  [ActivitiesTable.used]: 0 | 1;
  attachment: IAttachment[];
}

export type TFormActivity = {
  [ActivitiesTable.name]: string;
  [ActivitiesTable.description]?: string;
  [ActivitiesTable.price]: number;
  [ActivitiesTable.pleasure]?: number;
  [ActivitiesTable.location]: string;
};
