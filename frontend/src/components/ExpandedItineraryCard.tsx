import React from "react";
import { Tooltip } from "react-tooltip";
import { ItineraryItem } from "../types";

const ExpandedItineraryCard: React.FC<{
  item: ItineraryItem;
  onClose: () => void;
}> = ({ item, onClose }) => (
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

export default ExpandedItineraryCard;
