import { AccomodationsTable } from "./DataBaseModel";

export default interface IAccomodation {
  [AccomodationsTable.id]: number;
  [AccomodationsTable.id_trip]: number;
  [AccomodationsTable.name]: string;
  [AccomodationsTable.description]: string;
  [AccomodationsTable.price]: number;
  [AccomodationsTable.location]: string;
  [AccomodationsTable.attachment]: string;
  [AccomodationsTable.checkin]: string;
  [AccomodationsTable.checkout]: string;
  [AccomodationsTable.used]: boolean;
}
