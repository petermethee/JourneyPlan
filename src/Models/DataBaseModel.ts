export enum TablesName {
  trips = "trips",
  activities = "activities",
  transports = "transports",
  accomodations = "accomodations",
  plannings = "plannings",
  planning_artifact = "planning_artifact",
  attachments = "attachments",
}

export enum TripsTable {
  id = "id",
  name = "name",
  startDate = "start_date",
  endDate = "end_date",
  nbTravelers = "nb_travelers",
  imagePath = "image_path",
  breakfast = " breakfast",
  lunch = " lunch",
  dinner = " dinner",
  currency = "currency",
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
  lat = "lat",
  lng = "lng",
  city = "city",
  status = "status",
}

export enum TransportsTable {
  id = "id",
  id_trip = "id_trip",
  name = "name",
  description = "description",
  duration = "duration",
  from = "departure",
  to = "destination",
  price = "price",
  lat_from = "lat_from",
  lat_to = "lat_to",
  lng_from = "lng_from",
  lng_to = "lng_to",
  city_from = "city_from",
  city_to = "city_to",
  status = "status",
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
  lat = "lat",
  lng = "lng",
  city = "city",
  status = "status",
  breakfast = "breakfast",
  lunch = "lunch",
  dinner = "dinner",
}

export enum PlanningArtifactTable {
  id = "id",
  id_planning = "id_planning",
  id_activity = "id_activity",
  id_transport = "id_transport",
  id_accomodation = "id_accomodation",
  date = "date",
  timeIndex = "timeIndex",
}

export enum PlanningsTable {
  id = "id",
  id_trip = "id_trip",
  name = "name",
}

export enum AttachmentsTable {
  id = "id",
  name = "name",
  path = "path",
  id_activity = "id_activity",
  id_transport = "id_transport",
  id_accomodation = "id_accomodation",
}
