import React from "react";
import LoadingEllipsis from "./LoadingEllipsis";

const LoadingScreen: React.FC = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <p className="text-2xl font-semibold text-gray-800">
        Loading itinerary
        <LoadingEllipsis />
      </p>
      <p className="text-gray-500 text-sm mt-2">
        This may take about 30 seconds
      </p>
    </div>
  </div>
);

export default LoadingScreen;
