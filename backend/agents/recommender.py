from concurrent.futures import ThreadPoolExecutor
import os
from dotenv import load_dotenv
from openai import OpenAI

import json

load_dotenv()
client = OpenAI()


class RecommenderAgent:
    def generate_recommendations(self, travel_info):
        system_prompt = f"""
        You are a travel agent that excels at providing recommendations to clients.
        You will be given some data about a particular user looking to plan a travel itinerary and their preferences.
        I would like you to generate many recommendations based on the provided user's preferences.
        Please output your recommendations as a JSON object with two attributes. The first attribute should have
        key 'activity_recommendations', which itself maps to a list of JSON objects (a list in this instance being enclosed by square brackets []) 
        where each JSON object represents a recommended thing the user should do. Each entry in the list should have the following structure:
        {{
          'id': A unique integer identifier for the recommendation
          'title': A short title for the recommendation that outlines the activity or place the user should do/visit, e.g. 'Visit the Louvre Museum'
          'description': An enticing description of the recommendation, e.g. 'One of the world's largest art museum and a historic monument in Paris, France.'
          'reasoning': A brief explanation of why this recommendation was made, potentially using the user's preferences or the search results in your response.
        }}
        The second attribute should have the key 'accommodation_recommendations' which itself maps to a list of JSON objects (a list in this instance being enclosed by square brackets []) 
        where each JSON object represents an accommodation parsed from the user's input. Each entry in the list should have the following structure:
        {{
            'name': The name of the accommodation, e.g. 'Hotel de Crillon'
            'link': A link to the accommodation, also taken from the user's input e.g. 'https://www.rosewoodhotels.com/en/hotel-de-crillon'
        }}
        Ensure that you provide a diverse set of recommendations that are based on the search results provided.
        Also ensure that that there are enough recommendations to fill the user's itinerary for the trip.
        """
        user_prefs = travel_info["user_form_submission"]
        user_prompt = f"""
            I want to travel to {user_prefs['location']} during {user_prefs['time_range']} 
            for {user_prefs['time_range']} and has a {user_prefs['budget']} budget. I am interested in the following things: {','.join(user_prefs['interests'])} 
            I have gathered the following list of search queries and their respective search results for you use as context when generating recommendations
            for both activities and accommodation:\n 
            {travel_info['activity_research_results']}\n
            {travel_info['accommodation_research_results']}
            """

        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {"role": "user", "content": user_prompt},
            ],
        )
        print(response)
        res = response.choices[0].message.content
        print("Recommendations:")
        print(res)
        return res

    def run(self, travel_info):
        try:
            travel_info["activity_recommendations"] = json.loads(
                self.generate_recommendations(travel_info)
            )["activity_recommendations"]
            travel_info["accommodation_recommendations"] = json.loads(
                self.generate_recommendations(travel_info)
            )["accommodation_recommendations"]
            return travel_info
        except Exception as e:
            print(f"Error during recommendation generation: {e}")
            raise e
