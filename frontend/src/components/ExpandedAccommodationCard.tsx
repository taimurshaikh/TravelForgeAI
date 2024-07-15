import React from "react";
import { Accommodation } from "../types";

interface ExpandedAccommodationCardProps {
  accommodation: Accommodation;
  onClose: () => void;
}

const ExpandedAccommodationCard: React.FC<ExpandedAccommodationCardProps> = ({
  accommodation,
  onClose,
}) => (
  <div className="bg-white rounded-lg shadow-lg p-8 h-full overflow-y-auto">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-4xl font-bold text-gray-800">{accommodation.name}</h3>
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

    {/* Image placeholder */}
    <div className="mb-6 overflow-hidden rounded-lg bg-gray-200">
      <div className="aspect-w-16 aspect-h-9 flex items-center justify-center">
        {accommodation.image_url ? (
          <img
            src={accommodation.image_url}
            className="object-cover w-full h-full"
          />
        ) : (
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    </div>

    <div>
      <span className="font-semibold">
        <a className="no_underline hover:underline" href={accommodation.link}>
          {accommodation.link}
        </a>
      </span>
    </div>
  </div>
);

export default ExpandedAccommodationCard;
