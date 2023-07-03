export enum TablesName {
  trips = "trips",
  activities = "activities",
  transports = "transports",
  accomodations = "accomodations",
  plannings = "plannings",
  attachments = "attachments",
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
  contraint = "contraint",
  used = "used",
}

export enum TransportsTable {
  id = "id",
  id_trip = "id_trip",
  name = "name",
  description = "description",
  duration = "duration",
  from = "from",
  to = "to",
  vehicule = "vehicule",
  price = "price",
  used = "used",
}

export enum AccomodationsTable {
  id = "id",
  id_trip = "id_trip",
  name = "name",
  description = "description",
  price = "price",
  location = "location",
  checkin = "checkin",
  checkout = "checkout",
  used = "used",
}

export enum PlanningArtifactTable {
  id = "id",
  artifactId = "artifactId",
  date = "date",
  timeIndex = "timeIndex",
  artifactType = "artifactType",
}

export enum AttachmentsTable {
  id = "id",
  name = "name",
  path = "path",
  id_activity = "id_activity",
  id_transport = "id_transport",
  id_accomodation = "id_accomodation",
}
