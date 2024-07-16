export interface RecommendedActivity {
  id: number;
  title: string;
  description: string;
  reasoning: string;
}

export interface ItineraryItem {
  day: number;
  activity_recs: Array<RecommendedActivity>;
}

export interface Accommodation {
  name: string;
  link: string;
  image: string | null;
}

export interface ApiResponse {
  id: string;
  state: string;
  result: {
    accomm_recs: Accommodation[];
    itinerary: ItineraryItem[];
  };
}
