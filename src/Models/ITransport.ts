import { TransportsTable } from "./DataBaseModel";

export default interface ITransport {
  [TransportsTable.id]: number;
  [TransportsTable.id_trip]: number;
  [TransportsTable.name]: string;
  [TransportsTable.description]: string;
  [TransportsTable.duration]: number;
  [TransportsTable.price]: number;
  [TransportsTable.from]: string;
  [TransportsTable.to]: string;
  [TransportsTable.vehicule]: string;
  [TransportsTable.used]: number;
  attachment: { path: string; name: string }[];
}
