import { TransportsTable } from "./DataBaseModel";
import IAttachment from "./IAttachment";

export default interface ITransport {
  [TransportsTable.id]: number;
  [TransportsTable.id_trip]: number;
  [TransportsTable.name]: string; //le titre est en réalité le véhicule utilisé
  [TransportsTable.description]: string;
  [TransportsTable.duration]: number;
  [TransportsTable.price]: number;
  [TransportsTable.from]: string;
  [TransportsTable.to]: string;
  [TransportsTable.used]: number;
  [TransportsTable.lat_from]: number | null;
  [TransportsTable.lat_to]: number | null;
  [TransportsTable.lng_from]: number | null;
  [TransportsTable.lng_to]: number | null;
  attachment: IAttachment[];
}

export type TFormTransport = {
  [TransportsTable.name]: string;
  [TransportsTable.description]: string;
  [TransportsTable.price]: number;
  [TransportsTable.from]: string;
  [TransportsTable.to]: string;
  [TransportsTable.lat_from]: number | null;
  [TransportsTable.lat_to]: number | null;
  [TransportsTable.lng_from]: number | null;
  [TransportsTable.lng_to]: number | null;
};
