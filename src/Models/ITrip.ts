import { TripsTable } from "./DataBaseModel";

export default interface ITrip {
  [TripsTable.id]: number;
  [TripsTable.name]: string;
  [TripsTable.startDate]: string;
  [TripsTable.endDate]: string;
  [TripsTable.nbTravelers]: number;
  [TripsTable.imagePath]: string | null;
}
export type TFormTrip = {
  [TripsTable.name]: string;
  [TripsTable.nbTravelers]: number;
  [TripsTable.imagePath]: string | null;
  fileName: string;
};

export const transformFormToTrip = (
  form: TFormTrip,
  dateRange: Date[],
  tripId?: string
): ITrip => {
  return {
    id: tripId ? parseInt(tripId) : 0,
    image_path: form.image_path,
    name: form.name,
    nb_travelers: form.nb_travelers,
    start_date: dateRange[0].toDateString(),
    end_date: dateRange[1].toDateString(),
  };
};