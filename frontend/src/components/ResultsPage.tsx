import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ItineraryCard from "@components/ItineraryCard";
import AccommodationCard from "@components/AccommodationCard";
import ExpandedAccommodationCard from "@components/ExpandedAccommodationCard";
import ExpandedItineraryCard from "@components/ExpandedItineraryCard";
import LoadingScreen from "@components/LoadingScreen";
import ErrorScreen from "@components/ErrorScreen";
import useTaskResults from "@hooks/useTaskResults";
import { StylizedButton } from "./StylizedButton";

/**
 * ResultsPage component displays the generated itinerary and accommodation recommendations.
 * @returns {JSX.Element} The rendered ResultsPage component
 */
const ResultsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { loading, result, error } = useTaskResults(taskId);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedAccommodation, setExpandedAccommodation] = useState<
    string | null
  >(null);

  /**
   * Handles the click event on an itinerary card.
   * @param {number} day - The day number of the clicked itinerary card
   */
  const handleCardClick = (day: number) => {
    setExpandedDay(day);
    setExpandedAccommodation(null);
  };

  /**
   * Handles the click event on an accommodation card.
   * @param {string} name - The name of the clicked accommodation
   */
  const handleAccommodationClick = (name: string) => {
    setExpandedAccommodation(name);
    setExpandedDay(null);
  };

  /**
   * Closes the expanded card view.
   */
  const handleCardClose = () => {
    setExpandedDay(null);
    setExpandedAccommodation(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!result) {
    return <ErrorScreen message="No data available" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Your Itinerary
          </h2>
          <StylizedButton
            text="Generate Map"
            color="violet"
            extraClasses="px-8 py-2 h-12"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sector: Itinerary content and Accommodation */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Daily Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {result.result.itinerary?.map((item) => (
                <ItineraryCard
                  key={item.day}
                  item={item}
                  onClick={() => handleCardClick(item.day)}
                />
              ))}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Suggested Accommodations
            </h3>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {result.result.accomm_recs?.map((accommodation, index) => (
                <AccommodationCard
                  key={index}
                  accommodation={accommodation}
                  onClick={() => handleAccommodationClick(accommodation.name)}
                />
              ))}
            </div>
          </div>

          {/* Right sector: Expanded Card (Itinerary or Accommodation) */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md min-h-[500px] flex items-center justify-center">
            {expandedDay && result.result.itinerary ? (
              <ExpandedItineraryCard
                item={
                  result.result.itinerary.find(
                    (item) => item.day === expandedDay
                  )!
                }
                onClose={handleCardClose}
              />
            ) : expandedAccommodation && result.result.accomm_recs ? (
              <ExpandedAccommodationCard
                accommodation={
                  result.result.accomm_recs.find(
                    (item) => item.name === expandedAccommodation
                  )!
                }
                onClose={handleCardClose}
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-xl text-gray-500">
                  Select a day or accommodation to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
