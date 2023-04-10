export enum TablesName {
  trips = "trips",
  activities = "activities",
  transports = "transports",
  accomodations = "accomodations",
  plannings = "plannings",
}

export enum TripsTable {
  id = "id",
  name = "name",
  startDate = "start_date",
  endDate = "end_date",
  nbTravelers = "nb_travelers",
  imagePath = "image_path",
}

export enum ActivitiesTable {
  id = "id",
  id_trip = "id_trip",
  name = "name",
  description = "description",
  duration = "duration",
  price = "price",
  pleasure = "pleasure",
  location = "location",
  attachment = "attachment",
  contraint = "contraint",
}

export enum TransportsTable {
  id = "id",
  id_trip = "id_trip",
  name = "name",
  description = "description",
  duration = "duration",
  from = "from",
  to = "",
  vehicule = "",
  price = "price",
  attachment = "attachment",
}

export enum AccomodationsTable {
  id = "id",
  id_trip = "id_trip",
  name = "name",
  description = "description",
  price = "price",
  location = "location",
  attachment = "attachment",
  checkin = "checkin",
  checkout = "checkout",
}

export enum PlanningActivityTable {
  id = "id",
  activity = "activity",
  date = "date",
  hour = "hour",
}
