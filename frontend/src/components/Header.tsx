import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default anchor behavior
    navigate("/");
  };

  return (
    <header className="w-full bg-gray-100 py-4 top-16 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <a href="/" onClick={handleClick} className="block">
          <h1 className="text-4xl font-bold text-center">TravelForge ✈️⚒️</h1>
        </a>
      </div>
    </header>
  );
};

export default Header;
