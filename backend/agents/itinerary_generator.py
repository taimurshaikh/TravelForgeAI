import os
from dotenv import load_dotenv
from openai import OpenAI

import json

load_dotenv()
client = OpenAI()


class ItineraryGeneratorAgent:
    def generate_itinerary(self, travel_info):
        system_prompt = f"""
        You are a travel agent that excels at taking some recommended places and providing a coherent itinerary.
        You will be given a list of objects representing recommended places to visit and things to do in a particular city over a specified number of days.
        Each object has a unique identifier.
        I would like you to look over these recommendations generate an itinerary that outlines which recommended places to visit and things to do each day.
        Please output your itinerary as JSON object with a single attribute 'itinerary', which itself maps to a a list of JSON objects which 
        each represent a day in the itinerary. Each entry in the list should have the following structure:
        {{
            'day': The day number of the itinerary, e.g. 1
            'recommended_activity_ids': A list of the unique integer identifers ONLY of the recommendation activities the user should do/visit on this particular day
        }}

        It is crucial that each activity is only recommended once over the course of the trip.
            
        Ensure that you provide a coherent itinerary that makes sense for the user's trip and preferences.
        Ensure that you provide a diverse set of recommendations that cater to the search results provided.
        Also ensure that that the itinerary is filled with enough activities to fill the user's itinerary for the trip, and make sure the particular activity
        makes sense to do on that particular day. You can include a brief but well-written, light-hearted explanation of why the activity was placed on that day if you desire.
        """

        user_prefs = travel_info["user_form_submission"]
        user_prompt = f"""
            The user is travelling to {user_prefs['location']} for {user_prefs['num_days']} days during {user_prefs['time_range']}.

            Here are the recommendations for the user's trip: {travel_info['activity_recs']}
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

        res = response.choices[0].message.content
        return res

    def run(self, travel_info):
        try:
            res = json.loads(self.generate_itinerary(travel_info))["itinerary"]
            # get the recommendations corresponding to the ids in the itinerary
            travel_info["itinerary"] = [
                {
                    "day": itinerary_day["day"],
                    "activity_recs": [
                        rec
                        for rec in travel_info["activity_recs"]
                        if rec["id"] in itinerary_day["recommended_activity_ids"]
                    ],
                }
                for itinerary_day in res
            ]
            print(travel_info)
            return travel_info
        except Exception as e:
            print("Error in ItineraryGeneratorAgent: ", e)
            raise e
