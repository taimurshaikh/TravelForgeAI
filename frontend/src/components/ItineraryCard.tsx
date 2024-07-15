import React from "react";
import Card from "./Card";
import { ItineraryItem } from "../types";

interface ItineraryCardProps {
  item: ItineraryItem;
  onClick: () => void;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ item, onClick }) => {
  return (
    <Card
      title={`Day ${item.day}`}
      content={
        item.recommended_activities
          ? `${item.recommended_activities.length} activities planned`
          : "No activities planned"
      }
      onClick={onClick}
    />
  );
};

export default ItineraryCard;
