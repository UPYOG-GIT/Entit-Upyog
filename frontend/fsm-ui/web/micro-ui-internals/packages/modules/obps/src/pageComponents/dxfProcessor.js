import { DxfParser } from 'dxf-parser';
import proj4 from 'proj4';

export const processDXFFile = (dxfContent) => {
  const parser = new DxfParser();
  try {
    const dxf = parser.parseSync(dxfContent); // Parse the DXF file content
    const geojson = convertDXFToGeoJSON(dxf); // Convert to GeoJSON
    return geojson;
  } catch (error) {
    console.error("Error parsing DXF file:", error);
    return null;
  }
};

// Function to convert DXF to GeoJSON format
const convertDXFToGeoJSON = (dxf) => {
  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  // Loop through the entities in the DXF file
  dxf.entities.forEach((entity) => {
    if (entity.type === "LINE" || entity.type === "LWPOLYLINE" || entity.type === "POLYLINE") {
      const coordinates = entity.vertices.map((vertex) => [vertex.x, vertex.y]);
      if (coordinates.length > 0) {
        const feature = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates,
          },
          properties: {
            layer: entity.layer || "default", // Store layer information
          },
        };
        geojson.features.push(feature);
      }
    }
  });

  return geojson;
};

// Function to find the polyline closest to a specific coordinate
export const findPolylineByCoordinate = (geojson, targetCoordinate, sourceCRS, targetCRS) => {
  const [targetLon, targetLat] = targetCoordinate;
  let closestFeature = null;
  let minDistance = Infinity;

  geojson.features.forEach((feature) => {
    if (feature.geometry.type === "LineString") {
      const transformedCoords = feature.geometry.coordinates.map(([x, y]) =>
        proj4(sourceCRS, targetCRS, [x, y])
      );

      transformedCoords.forEach(([lon, lat]) => {
        const distance = Math.sqrt((lon - targetLon) ** 2 + (lat - targetLat) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestFeature = {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: transformedCoords,
            },
          };
        }
      });
    }
  });

  // Return the closest polyline feature
  return closestFeature;
};
