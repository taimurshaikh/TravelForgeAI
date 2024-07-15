import React from "react";
import LoadingEllipsis from "./LoadingEllipsis";

const LoadingScreen: React.FC = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-50">
    <p className="text-2xl font-semibold text-gray-800">
      Loading itinerary
      <LoadingEllipsis />
    </p>
  </div>
);

export default LoadingScreen;
