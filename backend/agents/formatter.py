import numpy as np
from scipy.optimize import linear_sum_assignment
from thefuzz import fuzz


class FormatterAgent:
    """
    This agent takes the generated itinerary and formats it into the final response format to be sent to the user.
    """

    def match_names_to_urls(names: list, urls: list) -> dict:
        """
        Matches names to URLs based on similarity scores using the Hungarian algorithm.

        Args:
            names (list): List of names to match.
            urls (list): List of URLs to match with names.

        Returns:
            dict: A dictionary mapping each name to the best matching URL.
        """
        # Create a similarity score matrix
        score_matrix = np.zeros((len(names), len(urls)))

        # Compute the similarity scores
        for i, name in enumerate(names):
            for j, url in enumerate(urls):
                score_matrix[i, j] = fuzz.ratio(name, url)

        # Apply the Hungarian algorithm to find the optimal assignment
        row_ind, col_ind = linear_sum_assignment(score_matrix, maximize=True)

        print("The assignment is: ", row_ind, col_ind)

        name_to_url_mapping = {}
        used_urls = set()

        # Create the name to URL mapping
        for i, j in zip(row_ind, col_ind):
            name_to_url_mapping[names[i]] = urls[j]
            used_urls.add(urls[j])

        return name_to_url_mapping

    def remove_ids_from_itinerary_activities(itinerary: list) -> list:
        """
        Removes 'id' keys from the activity recommendations in the itinerary.

        Args:
            itinerary (list): List of itinerary entries.

        Returns:
            list: Itinerary with 'id' keys removed from activity recommendations.
        """
        for entry in itinerary:
            for activity in entry["activity_recs"]:
                del activity["id"]
        return itinerary

    def run(self, complete_response: dict) -> dict:
        """
        Formats the complete response by matching accommodation names to URLs and
        removing 'id' keys from itinerary activities.

        Args:
            complete_response (dict): The complete response containing accommodation
                                      recommendations and itinerary.

        Returns:
            dict: Formatted response ready to be sent to the user.
        """
        try:
            # Match accommodation names to URLs
            accomm_name_url_mapping = self.match_names_to_urls(
                [k["name"] for k in complete_response["accomm_recs"]],
                complete_response["accomm_research_results"][0]["images"],
            )

            # Format accommodation recommendations with image URLs
            formatted_accomm_recs = [
                {
                    "name": k["name"],
                    "link": k["link"],
                    "image": accomm_name_url_mapping[k["name"]],
                }
                for k in complete_response["accomm_recs"]
            ]

            # Remove 'id' keys from itinerary activities
            formatted_itinerary = self.remove_ids_from_itinerary_activities(
                complete_response["itinerary"]
            )

            # Combine formatted accommodations and itinerary into the final response
            formatted_response = {
                "accomm_recs": formatted_accomm_recs,
                "itinerary": formatted_itinerary,
            }

            return formatted_response
        except Exception as e:
            print("Error in FormatterAgent: ")
            print(e)
            raise e
