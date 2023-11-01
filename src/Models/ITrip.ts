import { TripsTable } from "./DataBaseModel";

export default interface ITrip {
  [TripsTable.id]: number;
  [TripsTable.name]: string;
  [TripsTable.startDate]: string;
  [TripsTable.endDate]: string;
  [TripsTable.nbTravelers]: number;
  [TripsTable.imagePath]: string | null;
  [TripsTable.breakfast]: number;
  [TripsTable.lunch]: number;
  [TripsTable.dinner]: number;
  [TripsTable.currency]: string;
}
export type TFormTrip = {
  [TripsTable.name]: string;
  [TripsTable.nbTravelers]: number;
  [TripsTable.imagePath]: string | null;
  [TripsTable.currency]: string;
  fileName: string;
};

export const transformFormToTrip = (
  form: TFormTrip,
  dateRange: [string, string],
  tripId?: string
): ITrip => {
  return {
    id: tripId ? parseInt(tripId) : 0,
    image_path: form.image_path,
    name: form.name,
    nb_travelers: form.nb_travelers,
    start_date: dateRange[0],
    end_date: dateRange[1],
    breakfast: 5,
    lunch: 15,
    dinner: 15,
    currency: form.currency,
  };
};
