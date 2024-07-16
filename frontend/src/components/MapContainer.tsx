import React, { useState } from "react";
import Map from "./Map";
import ErrorScreen from "./ErrorScreen";

export const MapContainer = () => {
  const [error, setError] = useState(null);

  const parisLandmarks = [
    { name: "Eiffel Tower", lat: 39.16534056299675, lng: -84.63366551454087 },
  ];

  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <Map />
      </div>
    </div>
  );
};
