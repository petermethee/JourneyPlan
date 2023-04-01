import ITrip from "../../Models/ITrip";
import ITrips from "../../Models/ITrip";

export interface IElectronAPI {
  getAllTrips: () => Promise<ITrips[]>;
  insertTrip: (trip: ITrip) => Promise<void>;
}
