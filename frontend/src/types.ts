export interface RecommendedActivity {
  id: number;
  title: string;
  description: string;
  reasoning: string;
}

export interface ItineraryItem {
  day: number;
  recommended_activities: Array<RecommendedActivity>;
}

export interface Accommodation {
  name: string;
  link: string;
  image_url: string | null;
}

export interface ApiResponse {
  id: string;
  state: string;
  result: {
    location: string;
    time_range: string;
    budget: string;
    accommodation_type: string;
    num_days: number;
    interests: string[];
    activity_recommendations: any[];
    accommodation_recommendations: Accommodation[];
    activity_research_results: any[];
    accommodation_research_results: any[];
    itinerary: ItineraryItem[];
  };
}
