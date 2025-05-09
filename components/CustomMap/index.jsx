import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const locations = [
  {
    name: "Koroğlu Parkı",
    address: "Anvar Gasimzadeh 56c, Nasimi ray. Ganclik, Baku 1122",
    position: [49.8548, 40.3836], // Note: MapLibre uses [lng, lat] order
  },
  {
    name: "Michael Refili St",
    address: "9RMW+87Q, Michael Refili St, Baku",
    position: [49.845, 40.3775],
  },
];

// Available free styles
const mapStyles = {
  positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  darkMatter:
    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

const CustomMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.voyager, // You can change to positron or darkMatter
      center: [49.85, 40.38], // [lng, lat]
      zoom: 14,
      attributionControl: true,
    });

    // Add navigation controls (zoom in/out)
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add scale control
    map.current.addControl(new maplibregl.ScaleControl(), "bottom-left");

    // Add markers once map is loaded
    map.current.on("load", () => {
      // Add markers to the map
      locations.forEach((location) => {
        // Create custom marker element
        const markerEl = document.createElement("div");
        markerEl.className = "custom-marker";
        markerEl.style.width = "32px";
        markerEl.style.height = "32px";
        markerEl.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#a60b51" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `;

        // Add marker to map
        const marker = new maplibregl.Marker(markerEl)
          .setLngLat(location.position)
          .addTo(map.current);

        // Add click event to marker
        marker.getElement().addEventListener("click", () => {
          // Close existing popup if any
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }

          // Create popup
          const popup = new maplibregl.Popup({
            closeButton: true,
            offset: [0, -20],
          })
            .setLngLat(location.position)
            .setHTML(
              `
              <div style="font-family: sans-serif; padding: 4px;">
                <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px; color: #333;">
                  ${location.name}
                </h3>
                <p style="font-size: 13px; color: #666; margin: 0;">
                  ${location.address}
                </p>
              </div>
            `
            )
            .addTo(map.current);

          popupRef.current = popup;
          setSelectedLocation(location);
        });
      });
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default CustomMap;
