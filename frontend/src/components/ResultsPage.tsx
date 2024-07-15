import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ItineraryCard from "./ItineraryCard";
import AccommodationCard from "./AccommodationCard";
import ExpandedAccommodationCard from "./ExpandedAccommodationCard";
import ExpandedItineraryCard from "./ExpandedItineraryCard";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";
import LoadingEllipsis from "./LoadingEllipsis";
import { ApiResponse, ItineraryItem, Accommodation } from "../types";

const ResultsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedAccommodation, setExpandedAccommodation] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!taskId) return;

    let isMounted = true;
    const fetchResults = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `http://127.0.0.1:8000/task-status/${taskId}`
        );
        if (!isMounted) return;

        if (response.data.state === "SUCCESS") {
          setResult(response.data);
          setLoading(false);
        } else if (response.data.state === "PENDING") {
          setTimeout(fetchResults, 2000);
        } else {
          setError("Task failed or not found");
          setLoading(false);
        }
      } catch (error) {
        if (!isMounted) return;
        setError("Error fetching task status. Please try again later.");
        setLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  const handleCardClick = (day: number) => {
    setExpandedDay(day);
    setExpandedAccommodation(null);
  };

  const handleAccommodationClick = (name: string) => {
    setExpandedAccommodation(name);
    setExpandedDay(null);
  };

  const handleCardClose = () => {
    setExpandedDay(null);
    setExpandedAccommodation(null);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl font-semibold text-gray-800">
          Loading itinerary
          <LoadingEllipsis />
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Your Itinerary
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sector: Itinerary content and Accommodation */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Daily Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {result?.result.itinerary?.map(function (item) {
                return (
                  <ItineraryCard
                    key={item.day}
                    item={item}
                    onClick={() => handleCardClick(item.day)}
                  />
                );
              })}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Suggested Accommodations
            </h3>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {result?.result.accommodation_recommendations?.map(function (
                accommodation,
                index
              ) {
                accommodation.image_url =
                  result?.result.accommodation_research_results[0].images[
                    index
                  ];
                return (
                  <AccommodationCard
                    key={index}
                    accommodation={accommodation}
                    onClick={() => handleAccommodationClick(accommodation.name)}
                  />
                );
              })}
            </div>
          </div>

          {/* Right sector: Expanded Card (Itinerary or Accommodation) */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md min-h-[500px] flex items-center justify-center">
            {expandedDay && result?.result.itinerary ? (
              <ExpandedItineraryCard
                item={
                  result.result.itinerary.find(
                    (item) => item.day === expandedDay
                  )!
                }
                onClose={handleCardClose}
              />
            ) : expandedAccommodation &&
              result?.result.accommodation_recommendations ? (
              <ExpandedAccommodationCard
                accommodation={
                  result.result.accommodation_recommendations.find(
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
