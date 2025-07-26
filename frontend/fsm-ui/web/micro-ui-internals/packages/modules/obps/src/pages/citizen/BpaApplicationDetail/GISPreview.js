import React from "react";
import Map, { Source, Layer } from "react-map-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';

// const MAPBOX_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN"; // Replace with your Mapbox token

const mapboxAccessToken = globalConfigs?.getConfig("MAPBOX_PUBLIC_KEY");

const GISPreview = (gisData) => {
  return (
    <Map
      initialViewState={{
        longitude: gisData?.gisData?.longitude,
        latitude: gisData?.gisData?.latitude,
        zoom: 18,
      }}
      style={{ width: "600px", height: "300px" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={mapboxAccessToken}
    >
      <Source id="lines" type="geojson" data={gisData?.gisData?.additionalDetails?.markDetails}>
        <Layer
          id="line-layer"
          type="line"
          paint={{
            "line-color": "#FF0000",
            "line-width": 3,
          }}
        />
      </Source>
    </Map>
  );
};

export default GISPreview;
