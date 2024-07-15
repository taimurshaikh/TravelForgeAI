import React from "react";

interface ErrorScreenProps {
  message: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message }) => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-50">
    <p className="text-2xl font-semibold text-red-500">{message}</p>
  </div>
);

export default ErrorScreen;
