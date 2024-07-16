import React from "react";

interface StylizedButtonProps {
  text: string;
  color: string;
  extraClasses?: string;
}

export const StylizedButton: React.FC<StylizedButtonProps> = ({
  text,
  color,
  extraClasses,
}) => {
  return (
    <button
      className={`${
        extraClasses ?? ""
      } rounded overflow-hidden border border-${color}-600 bg-white text-${color}-600 shadow-2xl
relative transition-all duration-500 ease-in-out hover:text-white group`}
      type="submit"
    >
      <span className="relative z-10 text-base">{text}</span>
      <div className="absolute inset-0 h-full w-full scale-0 rounded transition-all duration-300 group-hover:scale-100">
        <div
          className={`absolute inset-0 h-full w-full bg-gradient-to-r from-${color}-600 via-${color}-500 to-${color}-400`}
        ></div>
      </div>
    </button>
  );
};
