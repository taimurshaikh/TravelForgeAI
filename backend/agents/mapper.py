import spacy
import requests


class MapperAgent:
    """
    This agent takes in recommended activities and returns the coordinates of the locations where the activities are located.
    """

    async def extract_locations_and_geocode(self, input_data):
        # Load spaCy model
        nlp = spacy.load("en_core_web_sm")

        # MapTiler API key (replace with your actual key)
        MAPTILER_API_KEY = "MY-MAPTILER-API-KEY"  # NOTE: put this in an old commit, but reprovisioned the key
        # Extract place names using NER
        doc = nlp(input_data["text"])
        print([e.label_ for e in doc.ents])
        place_names = [ent.text for ent in doc.ents if ent.label_ in "GPE"]

        # Use MapTiler Geocoding API to get coordinates
        response = requests.get(
            f"https://api.maptiler.com/geocoding/{input_data['text']}.json",
            params={"key": MAPTILER_API_KEY},
        )
        locations = []
        if response.status_code == 200:
            data = response.json()
            if data["features"]:
                # Get the first result
                feature = data["features"][0]
                locations.append(
                    {
                        "name": input_data["text"],
                        "lng": feature["center"][0],
                        "lat": feature["center"][1],
                    }
                )

        if not locations:
            raise Exception(detail="No locations found")

        return locations


async def main():
    test_input = {"text": "Union Hall in Cincinatti, OH"}

    mapper_agent = MapperAgent()
    locations = await mapper_agent.extract_locations_and_geocode(test_input)

    print("Extracted locations:")
    print(locations)


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
