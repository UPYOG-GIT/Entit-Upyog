import React, { useState, useRef, useEffect } from "react";
import ReactMapGL, { NavigationControl, Source, Layer } from "react-map-gl";
import proj4 from "proj4";
import { processDXFFile } from "./dxfProcessor";
import axios from "axios";
import 'mapbox-gl/dist/mapbox-gl.css';
const MapBoxGIS = ({ t, config, onSelect, formData = {},handleRemove,onSave }) => {
  const [viewport, setViewport] = useState({
    latitude: 21.221276,
    longitude: 81.651317,
    zoom: 18,
    width: "100vw",
    height: "100vh",
  });
  const [geojsonData, setGeojsonData] = useState(null);
  const [permanentFeatures, setPermanentFeatures] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(true);
  // const [mapboxAccessToken] = useState(
  //   "pk.eyJ1IjoiYmh1cGVzaGVudGl0IiwiYSI6ImNtM3IxeGY0djAxNDkybHI3NGlyOHZka3MifQ.DJ44H3NxwKpu6cy5UZ06AA"
  // );

  const mapboxAccessToken = globalConfigs?.getConfig("MAPBOX_PUBLIC_KEY");

  const sourceCRS = "+proj=utm +zone=33 +datum=WGS84";
  const targetCRS = "EPSG:4326";
  // console.log("coordinates: " + JSON.stringify(coordinates));
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [layerCoordinates, setLayerCoordinates] = useState({});
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [placeName, setPlaceName] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewport((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          // console.log("Updated location:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearchChange = (event) => {
    // event.preventDefault();
    setSearchQuery(event.target.value);
    // setIsOpen(true);
  };

  const onClose = () => {
    handleRemove();
    // setShowMap(false);
    // console.log("Map closed");
  };

  useEffect(() => {
    if (latitude && longitude) {
      getPlaceName(latitude, longitude).then((name) => setPlaceName(name));
    }
  }, [latitude, longitude]); // Runs when latitude or longitude changes
  
  const getPlaceName = async (lat, lon) => {
    const accessToken = mapboxAccessToken; // Replace with actual token
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features.length > 0) {
        return data.features[0].place_name;
      } else {
        return "Unknown location";
      }
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Error fetching location";
    }
  };

  const handleSave = () => {
    if (geojsonData) {
      const transformedGeojson = transformGeojsonData(geojsonData, dragOffset, rotation);
      onSave(
        transformedGeojson, latitude, longitude, placeName
      );
    } else {
           alert("No data to save.");
         }

  };

  // const onSave = () => {
  //   if (geojsonData) {
  //     const transformedGeojson = transformGeojsonData(geojsonData, dragOffset, rotation);
  //     console.log("Saved GeoJSON Data:", JSON.stringify(transformedGeojson));

  //     // Extract and log all coordinates
  //     const allMarkedCoordinates = [];
  //     transformedGeojson.features.forEach((feature) => {
  //       if (feature.geometry.type === "LineString") {
  //         feature.geometry.coordinates.forEach((coord) => {
  //           allMarkedCoordinates.push(coord);
  //         });
  //       }
  //       if (feature.geometry.type === "Polygon") {
  //         feature.geometry.coordinates.forEach((line) => {
  //           line.forEach((coord) => {
  //             allMarkedCoordinates.push(coord);
  //           });
  //         });
  //       }
  //     });
  //     console.log("All Marked Coordinates:", allMarkedCoordinates);

  //     alert("Data saved successfully! Check console for coordinates.");
      
  //   } else {
  //     alert("No data to save.");
  //   }
  // };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    // event.stopPropagation();
    // console.log("Search triggered! Page should NOT refresh.");
    if (!searchQuery) {
      alert("Please enter a search query.");
      return;
    }

    const latLonRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    if (latLonRegex.test(searchQuery)) {
      const [lat, lon] = searchQuery.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lon)) {
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lon,
          zoom: 18,
        });

        setShowMap(true);
      } else {
        alert("Invalid latitude and longitude format.");
      }
    } else {
      try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json`, {
          params: {
            access_token: mapboxAccessToken,
            limit: 1,
          },
        });

        if (response.data && response.data.features.length > 0) {
          const [lon, lat] = response.data.features[0].center;
          setViewport({
            ...viewport,
            latitude: lat,
            longitude: lon,
            zoom: 16,
          });

          setShowMap(true);
        } else {
          alert("No results found for the place entered.");
        }
      } catch (error) {
        alert("Error fetching place data.");
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    const userCoordinate = window.prompt("Enter target coordinate (latitude, longitude) in the format 'lat,lon':");
    if (!userCoordinate) {
      alert("No coordinate entered.");
      return;
    }

    const [targetLat, targetLon] = userCoordinate.split(",").map(Number);
    if (isNaN(targetLat) || isNaN(targetLon)) {
      alert("Invalid coordinate format.");
      return;
    }

    setLatitude(targetLat);
    setLongitude(targetLon);
    setGeojsonData(null);
    setPermanentFeatures([]);
    setCoordinates([]);
    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
    setLayerCoordinates({}); // Reset layer coordinates

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const geojson = await processDXFFile(content);
        if (geojson) {
          const layerCoords = {};
          const allCoordinates = [];
          const firstCoord = geojson.features[0]?.geometry.coordinates[0];
          if (firstCoord) {
            const [firstX, firstY] = firstCoord;
            const [firstLon, firstLat] = proj4(sourceCRS, targetCRS, [firstX, firstY]);

            const latOffset = targetLat - firstLat;
            const lonOffset = targetLon - firstLon;

            geojson.features.forEach((feature) => {
              feature.geometry.coordinates = feature.geometry.coordinates.map(([x, y]) => {
                const [lon, lat] = proj4(sourceCRS, targetCRS, [x, y]);
                const adjustedCoord = [lon + lonOffset, lat + latOffset];
                allCoordinates.push(adjustedCoord);
                return adjustedCoord;
              });

              const layerName = feature.properties?.layer || "default"; // Get layer name, default if not present
              if (!layerCoords[layerName]) {
                layerCoords[layerName] = [];
              }
              feature.geometry.coordinates.forEach((coord) => {
                if (Array.isArray(coord[0])) {
                  coord.forEach((c) => {
                    layerCoords[layerName].push(c);
                  });
                } else {
                  layerCoords[layerName].push(coord);
                }
              });
            });
          }
          setLayerCoordinates(layerCoords);
          setGeojsonData(geojson);
          setPermanentFeatures(geojson.features);
          setCoordinates(allCoordinates);
          // console.log("All Coordinates:", allCoordinates);
          // console.log("Layer Coordinates:", layerCoords);
        } else {
          alert("Failed to process DXF file.");
        }
      } catch (err) {
        alert("Error processing DXF file.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (deltaX, deltaY) => {
    setDragOffset((prev) => {
      const newOffset = {
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      };
      const draggedGeojson = transformGeojsonData(geojsonData, newOffset, rotation);
      updateLayerCoordinatesAfterRotation(draggedGeojson);
      return newOffset;
    });
  };

  const updateLayerCoordinatesAfterRotation = (rotatedGeojson) => {
    const newLayerCoords = {};
    rotatedGeojson.features.forEach((feature) => {
      const layerName = feature.properties?.layer || "default";
      if (!newLayerCoords[layerName]) {
        newLayerCoords[layerName] = [];
      }
      feature.geometry.coordinates.forEach((coord) => {
        if (Array.isArray(coord[0])) {
          coord.forEach((c) => {
            newLayerCoords[layerName].push(c);
          });
        } else {
          newLayerCoords[layerName].push(coord);
        }
      });
    });
    setLayerCoordinates(newLayerCoords);
    // console.log("Updated Layer Coordinates:", JSON.stringify(newLayerCoords));
  };

  const handleRotate = (angle) => {
    setRotation((prev) => {
      const newRotation = prev + angle;
      const rotatedGeojson = transformGeojsonData(geojsonData, dragOffset, newRotation);
      updateLayerCoordinatesAfterRotation(rotatedGeojson);
      return newRotation;
    });
  };

  const transformGeojsonData = (geojson, offset, rotationAngle) => {
    const center = getGeojsonCenter(geojson);
    const transformedFeatures = geojson.features.map((feature) => {
      const transformedCoordinates = feature.geometry.coordinates.map((coord) => {
        const [x, y] = coord;
        const [centerX, centerY] = proj4(targetCRS, sourceCRS, center);
        const [pointX, pointY] = proj4(targetCRS, sourceCRS, [x, y]);
        const rotated = rotatePoint(pointX, pointY, centerX, centerY, rotationAngle);
        const translated = [rotated.x + offset.x, rotated.y + offset.y];
        return proj4(sourceCRS, targetCRS, translated);
      });
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: transformedCoordinates,
        },
      };
    });
    return {
      ...geojson,
      features: transformedFeatures,
    };
  };

  const getGeojsonCenter = (geojson) => {
    let xSum = 0;
    let ySum = 0;
    let count = 0;
    geojson.features.forEach((feature) => {
      feature.geometry.coordinates.forEach((coord) => {
        xSum += coord[0];
        ySum += coord[1];
        count++;
      });
    });
    return [xSum / count, ySum / count];
  };

  const rotatePoint = (px, py, cx, cy, angle) => {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = cos * (px - cx) + sin * (py - cy) + cx;
    const ny = cos * (py - cy) - sin * (px - cx) + cy;
    return { x: nx, y: ny };
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(50% + 10px)",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "1200px",
        height: "600px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        overflow: "hidden", // Prevents buttons from overflowing
      }}
    >
      <div
        style={{
          padding: "10px",
          display: "flex",
          gap: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter place name or Latitude, Longitude"
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            type="submit"
            style={{
              background: "blue",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>
        <input
          type="file"
          accept=".dxf"
          onChange={handleFileUpload}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Controls for movement and rotation */}
        {geojsonData && (
          <div
            style={{
               background: "rgba(255, 255, 255, 0.8)",
        padding: "10px",
        borderRadius: "5px",
        display: "flex",
        gap: "10px",
        alignSelf: "flex-start",
            }}
          >
            <button onClick={() => handleDrag(-1, 0)}>←</button>
            <button onClick={() => handleDrag(1, 0)}>→</button>
            <button onClick={() => handleDrag(0, -1)}>↑</button>
            <button onClick={() => handleDrag(0, 1)}>↓</button>
            <button onClick={() => handleRotate(-1)}>Rotate Left</button>
            <button onClick={() => handleRotate(1)}>Rotate Right</button>
          </div>
        )}

      {/* Main Content Area (Map Container) */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <ReactMapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={mapboxAccessToken}
          onMove={(evt) => setViewport(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
        >
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <NavigationControl />
          </div>

          {geojsonData && (
            <Source id="dxf-source" type="geojson" data={transformGeojsonData(geojsonData, dragOffset, rotation)}>
              <Layer
                id="dxf-layer"
                type="line"
                paint={{
                  "line-color": "#ff0000",
                  "line-width": 2,
                }}
              />
            </Source>
          )}
        </ReactMapGL>

        
      </div>

      {/* Footer Buttons */}
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        <button
          style={{
            background: geojsonData ? "green" : "#aaa",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: geojsonData ? "pointer" : "not-allowed",
          }}
          onClick={handleSave}
          disabled={geojsonData === null}
        >
          Submit
        </button>
        <button
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MapBoxGIS;
