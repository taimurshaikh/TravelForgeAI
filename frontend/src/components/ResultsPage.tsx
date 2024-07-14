import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingEllipsis from "./LoadingEllipsis";
import { Tooltip } from "react-tooltip";

interface RecommendedActivity {
  id: number;
  title: string;
  description: string;
  reasoning: string;
}

interface ItineraryItem {
  day: number;
  recommended_activities: Array<RecommendedActivity>;
}

interface ApiResponse {
  id: string;
  state: string;
  result: {
    location: string;
    time_range: string;
    budget: string;
    accommodation_type: string;
    num_days: number;
    interests: string[];
    recommendations: any[];
    research_responses: any[];
    itinerary: ItineraryItem[];
  };
}

function ItineraryCard({
  item,
  onClick,
}: {
  item: ItineraryItem;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 transition-colors duration-200 cursor-pointer relative"
      onClick={onClick}
    >
      <div className="p-6">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Day {item.day}
        </h5>
        <p className="font-normal text-gray-700">
          {item.recommended_activities
            ? `${item.recommended_activities.length} activities planned`
            : "No activities planned"}
        </p>
      </div>
      <div className="absolute top-2 right-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}

const ExpandedCard: React.FC<{ item: ItineraryItem; onClose: () => void }> = ({
  item,
  onClose,
}) => (
  <div className="bg-white rounded-lg shadow-lg p-8 h-full overflow-y-auto">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-4xl font-bold text-gray-800">Day {item.day}</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
        aria-label="Close expanded card"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div>
      <h4 className="text-2xl font-semibold mb-4 text-gray-700">Activities:</h4>
      <ul className="space-y-4">
        {item.recommended_activities &&
        item.recommended_activities.length > 0 ? (
          item.recommended_activities.map((activity, index) => (
            <li
              key={index}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <a
                data-tooltip-id={`tooltip-${index}`}
                data-tooltip-content={activity.reasoning}
                className="block hover:bg-orange-100 rounded p-2 transition-colors duration-200"
              >
                <span className="font-semibold text-lg text-gray-800">
                  {activity.title}
                </span>
                <span className="block text-gray-600 text-sm mt-1">
                  {activity.description}
                </span>
              </a>
              <Tooltip
                id={`tooltip-${index}`}
                place="bottom-start"
                className="max-w-md bg-white text-gray-800 shadow-lg rounded-lg p-4 border border-gray-200"
              >
                <div className="whitespace-pre-wrap break-words">
                  <p>{activity.reasoning}</p>
                </div>
              </Tooltip>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No activities planned for this day.</li>
        )}
      </ul>
    </div>
  </div>
);

const ResultsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  };

  const handleCardClose = () => {
    setExpandedDay(null);
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
          {/* Left sector: Itinerary content */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result?.result.itinerary?.map((item) => (
                <ItineraryCard
                  key={item.day}
                  item={item}
                  onClick={() => handleCardClick(item.day)}
                />
              ))}
            </div>
          </div>

          {/* Right sector: Expanded Card or Google Maps */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md min-h-[500px]">
            {expandedDay && result?.result.itinerary ? (
              <ExpandedCard
                item={
                  result.result.itinerary.find(
                    (item) => item.day === expandedDay
                  )!
                }
                onClose={handleCardClose}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xl text-gray-500">
                  Select a day to view details
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
