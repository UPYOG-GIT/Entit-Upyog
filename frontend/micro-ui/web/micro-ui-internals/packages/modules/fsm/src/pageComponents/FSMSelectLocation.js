import React, { useEffect, useState } from "react";
import { FormStep, CardLabel, Dropdown, RadioButtons, LabelFieldPair, RadioOrSelect, TextInput } from "@upyog/digit-ui-react-components";
// import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
// import axios from "axios";
// import "mapbox-gl/dist/mapbox-gl.css";

const FSMSelectLocation = ({ t, config, onSelect, userType, formData = {} }) => {
//   const [viewport, setViewport] = useState({
//     latitude: 21.221276,
//     longitude: 81.651317,
//     zoom: 16,
//     width: "100vw",
//     height: "100vh",
//   });

//   const [searchQuery, setSearchQuery] = useState("");
//   const [markerLocation, setMarkerLocation] = useState(null);

//   const mapboxAccessToken = globalConfigs?.getConfig("MAPBOX_PUBLIC_KEY");

//   // Set current location on mount
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setViewport((prev) => ({ ...prev, latitude, longitude }));
//           setMarkerLocation({ latitude, longitude });
//         },
//         (error) => console.error("Geolocation error:", error)
//       );
//     }
//   }, []);

//   const handleSearchChange = (e) => setSearchQuery(e.target.value);

//   const handleSearchSubmit = async (e) => {
//     e.preventDefault();

//     if (!searchQuery) {
//       alert("Please enter a location.");
//       return;
//     }

//     try {
//       const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json`, {
//         params: {
//           access_token: mapboxAccessToken,
//           limit: 1,
//         },
//       });

//       if (response.data?.features?.length > 0) {
//         const [lon, lat] = response.data.features[0].center;
//         setViewport((prev) => ({
//           ...prev,
//           latitude: lat,
//           longitude: lon,
//           zoom: 16,
//         }));
//         setMarkerLocation({ latitude: lat, longitude: lon });
//       } else {
//         alert("Location not found.");
//       }
//     } catch (err) {
//       console.error("Search error:", err);
//       alert("Error fetching location.");
//     }
//   };

//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <LabelFieldPair>
//         {/* Search bar */}
//         <div
//           style={{
//             position: "absolute",
//             top: 20,
//             left: "50%",
//             transform: "translateX(-50%)",
//             zIndex: 1000,
//             display: "flex",
//             gap: "8px",
//             background: "#fff",
//             padding: "8px",
//             borderRadius: "8px",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//           }}
//         >
//           <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px" }}>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               placeholder="Search place or lat,lon"
//               style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "250px" }}
//             />
//             <button
//               type="submit"
//               style={{ padding: "8px 16px", borderRadius: "4px", border: "none", background: "#007bff", color: "white", cursor: "pointer" }}
//             >
//               Search
//             </button>
//           </form>
//           <button onClick={handleRemove} style={{ background: "red", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "4px" }}>
//             Close
//           </button>
//         </div>

//         {/* Map */}
//         <ReactMapGL
//           {...viewport}
//           mapboxAccessToken={mapboxAccessToken}
//           mapStyle="mapbox://styles/mapbox/streets-v11"
//           onMove={(evt) => setViewport(evt.viewState)}
//         >
//           <div style={{ position: "absolute", top: 10, left: 10 }}>
//             <NavigationControl />
//           </div>

//           {markerLocation && (
//             <Marker latitude={markerLocation.latitude} longitude={markerLocation.longitude} anchor="bottom">
//               <img src="https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png" alt="Marker" width={30} />
//             </Marker>
//           )}
//         </ReactMapGL>
//       </LabelFieldPair>
//     </div>
//   );
};

export default FSMSelectLocation;
