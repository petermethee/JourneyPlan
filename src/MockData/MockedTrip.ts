import { TripsTable } from "../Models/DataBaseModel";
import ITrip from "../Models/ITrip";

export const mockedTrip: ITrip = {
  [TripsTable.id]: 0,
  [TripsTable.name]: "mocked trip",
  [TripsTable.startDate]: "02/02/2022",
  [TripsTable.endDate]: "02/20/2022",
  [TripsTable.nbTravelers]: 1,
  [TripsTable.imagePath]: null,
};
