import { TransportsTable } from "./DataBaseModel";
import IAttachment from "./IAttachment";
import { EEventStatus } from "./EEventStatus";

export default interface ITransport {
  [TransportsTable.id]: number;
  [TransportsTable.id_trip]: number;
  [TransportsTable.name]: string; //le titre est en réalité le véhicule utilisé
  [TransportsTable.description]: string;
  [TransportsTable.duration]: number;
  [TransportsTable.price]: number;
  [TransportsTable.from]: string;
  [TransportsTable.to]: string;
  [TransportsTable.lat_from]: number | null;
  [TransportsTable.lat_to]: number | null;
  [TransportsTable.lng_from]: number | null;
  [TransportsTable.lng_to]: number | null;
  [TransportsTable.city_from]: string | null;
  [TransportsTable.city_to]: string | null;
  [TransportsTable.status]: EEventStatus;

  used: boolean;
  attachment: IAttachment[];
}

export type TFormTransport = {
  [TransportsTable.name]: string;
  [TransportsTable.description]: string;
  [TransportsTable.price]: string;
  [TransportsTable.from]: string;
  [TransportsTable.to]: string;
  [TransportsTable.lat_from]: number | null;
  [TransportsTable.lat_to]: number | null;
  [TransportsTable.lng_from]: number | null;
  [TransportsTable.lng_to]: number | null;
  [TransportsTable.city_from]: string | null;
  [TransportsTable.city_to]: string | null;
  [TransportsTable.status]: EEventStatus;
  [TransportsTable.duration]: number;
};
