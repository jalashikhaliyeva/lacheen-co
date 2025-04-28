import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const tileProviders = [
  {
    name: "OpenStreetMap (Standard)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "Stadia Maps (Alidade Smooth)",
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  },
  {
    name: "Stadia Maps (Outdoors)",
    url: "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  },
  {
    name: "CartoDB (Voyager)",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    name: "CyclOSM",
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution:
      '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
];
const selectedTileProvider = tileProviders[1];
const locations = [
  {
    name: "Koroğlu Parkı",
    address: "Anvar Gasimzadeh 56c, Nasimi ray. Ganclik, Baku 1122",
    position: [40.3836, 49.8548],
  },
  {
    name: "Michael Refili St",
    address: "9RMW+87Q, Michael Refili St, Baku",
    position: [40.3775, 49.845],
  },
];
const CustomIcon = ({ size = 32, color = "#FF0000" }) => {
  return L.divIcon({
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `,
    className: "custom-marker-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size / 2],
  });
};
const CustomMap = () => {
  return (
    <MapContainer
      center={[40.38, 49.85]}
      zoom={14}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        url={selectedTileProvider.url}
        attribution={selectedTileProvider.attribution}
      />

      {locations.map((location, index) => (
        <Marker
          key={index}
          position={location.position}
          icon={CustomIcon({
            size: 32,
            color: index === 0 ? "#a60b51" : "#a60b51",
          })}
        >
          <Popup className="custom-popup">
            <div className="font-sans p-1">
              <h3 className="font-bold text-lg mb-1 text-gray-800">
                {location.name}
              </h3>
              <p className="text-sm text-gray-600">{location.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CustomMap;
