import numpy as np
from dotenv import load_dotenv
from scipy.optimize import linear_sum_assignment
from thefuzz import fuzz

load_dotenv()


class FormatterAgent:
    """
    This agent takes the generated itinerary and formats it into the final response format to be sent to the user.
    """

    def match_names_to_urls(self, names: list, urls: list) -> dict:
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
        print("Score matrix: ", score_matrix)
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

    def remove_ids_from_itinerary_activities(self, itinerary: list) -> list:
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

    def run(self, travel_info: dict) -> dict:
        """
        Formats the complete response by matching accommodation names to URLs and
        removing 'id' keys from itinerary activities.

        Args:
            travel_info (dict): The complete response containing accommodation
                                      recommendations and itinerary.

        Returns:
            dict: Formatted response ready to be sent to the user.
        """
        try:
            # Match accommodation names to URLs
            accomm_name_url_mapping = self.match_names_to_urls(
                [k["name"] for k in travel_info["accomm_recs"]],
                travel_info["accomm_research_results"]["images"],
            )
            print("Did the mapping: ", accomm_name_url_mapping)

            # Format accommodation recommendations with image URLs
            formatted_accomm_recs = [
                {
                    "name": k["name"],
                    "link": k["link"],
                    "image": accomm_name_url_mapping[k["name"]],
                }
                for k in travel_info["accomm_recs"]
            ]

            print("Formatted Accommodation Recommendations: ", formatted_accomm_recs)

            # Remove 'id' keys from itinerary activities
            formatted_itinerary = self.remove_ids_from_itinerary_activities(
                travel_info["itinerary"]
            )

            print("Formatted Itinerary: ", formatted_itinerary)

            # Combine formatted accommodations and itinerary into the final response
            formatted_response = {
                "accomm_recs": formatted_accomm_recs,
                "itinerary": formatted_itinerary,
            }

            return formatted_response
        except Exception as e:
            print("Error in FormatterAgent: ")
            print(e.args)
            raise e


# # test data
# complete_response = {
#     "accomm_recs": [
#         {
#             "name": "Hotel de Crillon",
#             "link": "https://www.rosewoodhotels.com/en/hotel-de-crillon",
#         },
#         {"name": "The Ritz Paris", "link": "https://www.ritzparis.com/en-GB"},
#     ],
#     "accomm_research_results": [
#         {
#             "images": [
#                 "https://www.rosewoodhotels.com/en/hotel-de-crillon.jpg",
#                 "https://www.ritzparis.com/en-GB.jpg",
#             ]
#         }
#     ],
#     "itinerary": [
#         {
#             "activity_recs": [
#                 {
#                     "id": 1,
#                     "title": "Visit the Louvre Museum",
#                     "description": "One of the world's largest art museum and a historic monument in Paris, France.",
#                     "reasoning": "Based on user preferences and search results.",
#                 },
#                 {
#                     "id": 2,
#                     "title": "Explore the Eiffel Tower",
#                     "description": "A wrought-iron lattice tower on the Champ de Mars in Paris, France.",
#                     "reasoning": "Iconic landmark and popular tourist attraction.",
#                 },
#             ]
#         },
#         {
#             "activity_recs": [
#                 {
#                     "id": 3,
#                     "title": "Take a Seine River Cruise",
#                     "description": "Enjoy a scenic cruise along the Seine River in Paris, France.",
#                     "reasoning": "Relaxing way to see the city from a different perspective.",
#                 },
#                 {
#                     "id": 4,
#                     "title": "Visit Notre-Dame Cathedral",
#                     "description": "A medieval Catholic cathedral on the Île de la Cité in Paris, France.",
#                     "reasoning": "Historic and architectural significance.",
#                 },
#             ]
#         },
#     ],
# }

# # Initialize the FormatterAgent
# formatter_agent = FormatterAgent()

# # Format the complete response
# formatted_response = formatter_agent.run(complete_response)

# # Print the formatted response
# print(formatted_response)
