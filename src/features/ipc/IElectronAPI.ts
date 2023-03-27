import ITrips from "../../Models/Trips";

export interface IElectronAPI {
  getAllTrips: () => Promise<ITrips[]>;
}
