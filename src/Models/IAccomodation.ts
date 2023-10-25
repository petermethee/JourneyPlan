import { AccomodationsTable } from "./DataBaseModel";
import IAttachment from "./IAttachment";
import { EEventStatus } from "./EEventStatus";

export default interface IAccomodation {
  [AccomodationsTable.id]: number;
  [AccomodationsTable.id_trip]: number;
  [AccomodationsTable.name]: string;
  [AccomodationsTable.description]: string;
  [AccomodationsTable.price]: number;
  [AccomodationsTable.location]: string;
  [AccomodationsTable.checkin]: string;
  [AccomodationsTable.checkout]: string;
  [AccomodationsTable.used]: 0 | 1;
  [AccomodationsTable.lat]: number | null;
  [AccomodationsTable.lng]: number | null;
  [AccomodationsTable.city]: string | null;
  [AccomodationsTable.status]: EEventStatus;
  [AccomodationsTable.breakfast]: 0 | 1;
  [AccomodationsTable.lunch]: 0 | 1;
  [AccomodationsTable.dinner]: 0 | 1;

  attachment: IAttachment[];
}

export type TFormAccomodation = {
  [AccomodationsTable.name]: string;
  [AccomodationsTable.description]: string;
  [AccomodationsTable.price]: number;
  [AccomodationsTable.location]: string;
  [AccomodationsTable.checkin]: string;
  [AccomodationsTable.checkout]: string;
  [AccomodationsTable.lat]: number | null;
  [AccomodationsTable.lng]: number | null;
  [AccomodationsTable.city]: string | null;
  [AccomodationsTable.status]: EEventStatus;
  [AccomodationsTable.breakfast]: 0 | 1;
  [AccomodationsTable.lunch]: 0 | 1;
  [AccomodationsTable.dinner]: 0 | 1;
};
