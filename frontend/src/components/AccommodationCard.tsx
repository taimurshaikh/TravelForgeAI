import React from "react";
import Card from "./Card";
import { Accommodation } from "../types";

interface AccommodationCardProps {
  accommodation: Accommodation;
  onClick: () => void;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onClick,
}) => {
  return <Card title={accommodation.name} content={""} onClick={onClick} />;
};

export default AccommodationCard;
