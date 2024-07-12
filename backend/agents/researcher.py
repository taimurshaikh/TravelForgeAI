from tavily import TavilyClient
from concurrent.futures import ThreadPoolExecutor
import os
from dotenv import load_dotenv

load_dotenv()
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


class ResearcherAgent:
    """
    This agent is responsible for conducting research using the Tavily API and returning a summary of its findings.
    """

    def research_location(self, location_info: dict) -> dict:
        print(location_info)
        formatted_location = f"{location_info['city']}, {location_info['country']}"

        # Use Tavily to run some search queries
        search_queries = [
            f"Top tourist attractions in {formatted_location}",
            f"Things to do in {formatted_location} in {location_info['time_range']}",
            f"Best {location_info['budget']} {location_info['accomodation_type']} in {formatted_location}",
        ]

        # Specific interests
        for interest in location_info["interests"]:
            search_queries.append(
                f"Best {location_info['budget']} {interest} in {formatted_location}"
            )

        with ThreadPoolExecutor() as executor:
            research_results = list(
                executor.map(
                    # As a heuristic, we limit the number of results for each to half the number of days in the trip
                    # This ensures variety but also doesn't provide too much noise for downstream agents
                    lambda q: tavily_client.search(
                        query=q,
                        # search_depth="advanced",
                        max_results=location_info["num_days"] // 2,
                    ),
                    search_queries,
                )
            )

        return [r["results"] for r in research_results]

    def run(self, user_prefs: dict):
        try:
            travel_info = user_prefs
            travel_info["research_results"] = self.research_location(user_prefs)
            print("Research results:")
            print(travel_info["research_results"])
            with open("research_results.json", "w") as f:
                f.write(str(travel_info["research_results"]))
            return travel_info
        except Exception as e:
            print(f"Error during research: {e}")
            raise e
