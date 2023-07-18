import { AccomodationsTable } from "./DataBaseModel";
import IAttachment from "./IAttachment";

export default interface IAccomodation {
  [AccomodationsTable.id]: number;
  [AccomodationsTable.id_trip]: number;
  [AccomodationsTable.name]: string;
  [AccomodationsTable.description]: string;
  [AccomodationsTable.price]: number;
  [AccomodationsTable.location]: string;
  [AccomodationsTable.checkin]?: string;
  [AccomodationsTable.checkout]?: string;
  [AccomodationsTable.used]: number;
  attachment: IAttachment[];
}

export type TFormAccomodation = {
  [AccomodationsTable.name]: string;
  [AccomodationsTable.description]: string;
  [AccomodationsTable.price]: number;
  [AccomodationsTable.location]: string;
  [AccomodationsTable.checkin]?: string;
  [AccomodationsTable.checkout]?: string;
};
