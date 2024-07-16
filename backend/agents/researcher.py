import os

from dotenv import load_dotenv
from tavily import TavilyClient

from concurrent.futures import ThreadPoolExecutor

# Load environment variables from a .env file
load_dotenv()

# Initialize the TavilyClient with the API key from environment variables
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


class ResearcherAgent:
    """
    Conducts research using the Tavily API and returns a summary of findings.
    """

    def research_location_activities(self, user_prefs: dict) -> dict:
        """
        Research activities available at a given location.

        Args:
            user_prefs (dict): Information about the user's form submission

        Returns:
            dict: Results of the research on activities.
        """
        search_queries = [
            f"Top tourist attractions in {user_prefs['location']}",
            f"Things to do in {user_prefs['location']} in {user_prefs['time_range']}",
        ]

        # Add interest-based queries
        for interest in user_prefs["interests"]:
            search_queries.append(
                f"Best {user_prefs['budget']} {interest} in {user_prefs['location']}"
            )

        # Perform concurrent searches
        with ThreadPoolExecutor() as executor:
            activity_results = list(
                executor.map(
                    lambda q: tavily_client.search(
                        query=q,
                        search_depth="advanced",
                        max_results=min(user_prefs["num_days"], 5),
                    ),
                    search_queries,
                )
            )
        # Extract and return the results
        return [r["results"] for r in activity_results]

    def research_location_accomm(self, user_prefs: dict) -> dict:
        """
        Research accommodations available at a given location.

        Args:
            user_prefs (dict): Information about the user's form submission

        Returns:
            dict: Results of the research on accommodations.
        """
        accomm_results = tavily_client.search(
            query=f"Best {user_prefs['budget']} {user_prefs['accomm_type']} in {user_prefs['location']}",
            include_images=True,
            max_results=3,
        )

        return accomm_results

    def run(self, user_prefs: dict):
        """
        Run the research process based on user preferences.

        Args:
            user_prefs (dict): User's submitted preferences.

        Returns:
            dict: Research results.
        """
        try:
            travel_info = {"user_form_submission": user_prefs}
            travel_info["activity_research_results"] = (
                self.research_location_activities(user_prefs)
            )
            travel_info["accomm_research_results"] = self.research_location_accomm(
                user_prefs
            )
            print("Research completed successfully!")
            return travel_info
        except Exception as e:
            print("An error occurred during research:", e)
            raise e
