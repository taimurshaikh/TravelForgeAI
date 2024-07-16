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

    def research_location_activities(self, location_info: dict) -> dict:
        # Use Tavily to run some search queries
        search_queries = [
            f"Top tourist attractions in {location_info['location']}",
            f"Things to do in {location_info['location']} in {location_info['time_range']}",
        ]

        # Specific interests
        for interest in location_info["interests"]:
            search_queries.append(
                f"Best {location_info['budget']} {interest} in {location_info['location']}"
            )

        with ThreadPoolExecutor() as executor:
            activity_results = list(
                executor.map(
                    # As a heuristic, we limit the number of results to a given threshold
                    # This ensures variety but also doesn't provide too much noise for downstream agents
                    lambda q: tavily_client.search(
                        query=q,
                        search_depth="advanced",
                        max_results=min(location_info["num_days"], 5),
                    ),
                    search_queries,
                )
            )
        return [r["results"] for r in activity_results]

    def research_location_accomm(self, location_info: dict) -> dict:
        # Static amount of accomodation results
        accomm_results = (
            tavily_client.search(
                query=f"Best {location_info['budget']} {location_info['accomm_type']} in {location_info['location']}",
                include_images=True,
                max_results=3,
            ),
        )

        return accomm_results

    def run(self, user_prefs: dict):
        try:
            travel_info = {}
            travel_info["user_form_submission"] = user_prefs
            travel_info["activity_research_results"] = (
                self.research_location_activities(user_prefs)
            )
            travel_info["accomm_research_results"] = self.research_location_accomm(
                user_prefs
            )
            print("Research results:")
            print(travel_info["activity_research_results"])
            print(travel_info["accomm_research_results"])
            return travel_info
        except Exception as e:
            print(f"Error during research: {e}")
            raise e
