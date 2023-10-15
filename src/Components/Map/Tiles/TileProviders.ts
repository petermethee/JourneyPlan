export const MapTypes = [
  {
    name: "Sobre",
    maxZoom: 19,
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  },
  {
    name: "Détaillé niveau 1",
    maxZoom: 20,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "Détaillé niveau 2",
    maxZoom: 20,
    url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
  },
  {
    name: "Détaillées niveau 3",
    maxZoom: 20,
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  },
  /*    {
      name: "Old school",
      maxZoom: 20,
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    }, */

  {
    name: "Satellite",
    maxZoom: 20,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },

  {
    name: "OpenStreetMap",
    maxZoom: 19,
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    name: "Aéroport",
    maxZoom: 18,
    url: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
  },
  /*     {
      name: "terrain",
      maxZoom: 20,
      url: "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png",
    }, */
];
export const MapDetails = [
  {
    name: "Aucun",
    url: "",
    maxZoom: 1,
  },
  {
    name: "Train",
    url: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    maxZoom: 20,
  },
  {
    name: "Vélo",
    url: "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
    maxZoom: 20,
  },
  {
    name: "Randonnées",
    url: "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
    maxZoom: 20,
  },
];

export const SatelliteExtansions = [
  /*   {
    url: "https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png",
    maxZoom: 20,
  }, */
  {
    url: "https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png",
    maxZoom: 18,
  },
];
