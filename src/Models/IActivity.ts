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
  [ActivitiesTable.attachment]: { path: string; name: string }[];
  [ActivitiesTable.contraint]: string;
  [ActivitiesTable.used]: boolean;
}

export type TFormActivity = {
  [ActivitiesTable.name]: string;
  [ActivitiesTable.description]: string;
  [ActivitiesTable.duration]: number;
  [ActivitiesTable.price]: number;
  [ActivitiesTable.pleasure]: number;
  [ActivitiesTable.location]: string;
  [ActivitiesTable.attachment]: { path: string; name: string }[];
};

export const convertFromToActivity = (
  form: TFormActivity,
  id_trip: number
): IActivity => {
  return {
    [ActivitiesTable.id]: 0,
    [ActivitiesTable.id_trip]: id_trip,
    [ActivitiesTable.name]: form.name,
    [ActivitiesTable.description]: form.description,
    [ActivitiesTable.duration]: form.duration,
    [ActivitiesTable.price]: form.price,
    [ActivitiesTable.pleasure]: form.pleasure, //future improvement
    [ActivitiesTable.location]: form.location,
    [ActivitiesTable.attachment]: form.attachment,
    [ActivitiesTable.contraint]: "", //future improvement
    [ActivitiesTable.used]: false,
  };
};
