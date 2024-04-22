import { AccommodationsTable } from "./DataBaseModel";
import IAttachment from "./IAttachment";
import { EEventStatus } from "./EEventStatus";

export default interface IAccommodation {
  [AccommodationsTable.id]: number;
  [AccommodationsTable.id_trip]: number;
  [AccommodationsTable.name]: string;
  [AccommodationsTable.description]?: string;
  [AccommodationsTable.price]: number;
  [AccommodationsTable.location]: string;
  [AccommodationsTable.checkin]: string;
  [AccommodationsTable.checkout]: string;
  [AccommodationsTable.lat]: number | null;
  [AccommodationsTable.lng]: number | null;
  [AccommodationsTable.city]: string | null;
  [AccommodationsTable.status]: EEventStatus;
  [AccommodationsTable.breakfast]: 0 | 1;
  [AccommodationsTable.lunch]: 0 | 1;
  [AccommodationsTable.dinner]: 0 | 1;

  used: boolean;
  attachment: IAttachment[];
}

export type TFormAccommodation = {
  [AccommodationsTable.name]: string;
  [AccommodationsTable.description]?: string;
  [AccommodationsTable.price]: string;
  [AccommodationsTable.location]: string;
  [AccommodationsTable.checkin]: string;
  [AccommodationsTable.checkout]: string;
  [AccommodationsTable.lat]: number | null;
  [AccommodationsTable.lng]: number | null;
  [AccommodationsTable.city]: string | null;
  [AccommodationsTable.status]: EEventStatus;
  [AccommodationsTable.breakfast]: 0 | 1;
  [AccommodationsTable.lunch]: 0 | 1;
  [AccommodationsTable.dinner]: 0 | 1;
};
