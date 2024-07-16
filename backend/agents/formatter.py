from thefuzz import fuzz
import numpy as np
from scipy.optimize import linear_sum_assignment


class FormatterAgent:
    """
    This agent takes the generated itinerary and formats it into the final response format we want to send to the user.
    """

    def match_names_to_urls(self, names, urls):
        # Create a similarity score matrix
        score_matrix = np.zeros((len(names), len(urls)))

        for i, name in enumerate(names):
            for j, url in enumerate(urls):
                score_matrix[i, j] = fuzz.ratio(name, url)

        # Apply the Hungarian algorithm to find the optimal assignment
        row_ind, col_ind = linear_sum_assignment(score_matrix, maximize=True)

        name_to_url_mapping = {}
        used_urls = set()

        for i, j in zip(row_ind, col_ind):
            name_to_url_mapping[names[i]] = urls[j]
            used_urls.add(urls[j])

        return name_to_url_mapping

    def remove_ids_from_itinerary_activities(self, itinerary):
        for entry in itinerary:
            for activity in entry["activity_recs"]:
                if "id" in activity:
                    del activity["id"]
        return itinerary

    def run(self, complete_response: dict):
        res = {}
        accomm_name_url_mapping = self.match_names_to_urls(
            [k["name"] for k in complete_response["accomm_recs"]],
            complete_response["accomm_research_results"][0]["images"],
        )

        res["accomm_recs"] = [
            {
                "name": k["name"],
                "link": k["link"],
                "image": accomm_name_url_mapping[k["name"]],
            }
            for k in complete_response["accomm_recs"]
        ]

        res["itinerary"] = self.remove_ids_from_itinerary_activities(
            complete_response["itinerary"]
        )

        print("Formatted response:")
        print(res)

        return res
