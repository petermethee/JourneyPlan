export enum TripsTable {
  title = "trips",
  id = "id",
  name = "name",
  startDate = "start_date",
  endDate = "end_date",
  nbTravelers = "nb_travelers",
  imagePath = "image_path",
}

export default interface Trip {
  [TripsTable.id]: number;
  [TripsTable.name]: string;
  [TripsTable.startDate]: string;
  [TripsTable.endDate]: string;
  [TripsTable.nbTravelers]: number;
  [TripsTable.imagePath]: string;
}
