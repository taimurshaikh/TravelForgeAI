import React from "react";

interface CardProps {
  title: string;
  content: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, content, onClick }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 transition-colors duration-200 cursor-pointer relative"
      onClick={onClick}
    >
      <div className="p-6">
        <h5 className="mb-2 text-2xl tracking-tight text-gray-900">{title}</h5>
        <p className="font-normal text-gray-700">{content}</p>
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
};

export default Card;
