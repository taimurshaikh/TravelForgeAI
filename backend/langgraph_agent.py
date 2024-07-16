from typing import Dict
import os
import time
import json

from langgraph.graph import Graph

# Import agent classes
from agents import (
    ResearcherAgent,
    RecommenderAgent,
    ItineraryGeneratorAgent,
    FormatterAgent,
)


class TravelForgeAgent:
    def __init__(self):
        self.output_dir = f"outputs/run_{int(time.time())}"
        os.makedirs(self.output_dir, exist_ok=True)

    def run(self, user_form_submission: Dict[str, str]):
        print("Running TravelForgeAgent...")
        # Initialize agents
        researcher = ResearcherAgent()
        recommender = RecommenderAgent()
        itinerary_generator = ItineraryGeneratorAgent()
        formatter = FormatterAgent()

        # Define a Langchain graph
        graph_builder = Graph()

        # Add nodes for each agent
        graph_builder.add_node("research", researcher.run)
        graph_builder.add_node("recommend", recommender.run)
        graph_builder.add_node("generate_itinerary", itinerary_generator.run)
        graph_builder.add_node("formatter", formatter.run)

        # Define the edges between the agents
        graph_builder.add_edge("research", "recommend")
        graph_builder.add_edge("recommend", "generate_itinerary")
        graph_builder.add_edge("generate_itinerary", "formatter")

        # Set up start and end nodes
        graph_builder.set_entry_point("research")
        graph_builder.set_finish_point("formatter")

        # Compile the graph
        graph = graph_builder.compile()
        print("Graph compiled successfully!")
        # Run the graph
        print("Running the graph with user form submission...", user_form_submission)
        res = graph.invoke(user_form_submission)

        # Write the output to the output directory
        with open(f"{self.output_dir}/output.json", "w") as f:
            f.write(json.dumps(res, indent=4))

        return res
