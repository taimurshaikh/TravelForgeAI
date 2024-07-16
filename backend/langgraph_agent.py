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
    def run(self, user_form_submission: Dict[str, str]):
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
        graph_builder.add_node("format", formatter.run)

        # Define the edges between the agents
        graph_builder.add_edge("research", "recommend")
        graph_builder.add_edge("recommend", "generate_itinerary")
        graph_builder.add_edge("generate_itinerary", "format")

        # Set up start and end nodes
        graph_builder.set_entry_point("research")
        graph_builder.set_finish_point("format")

        # Compile the graph
        graph = graph_builder.compile()
        print("Graph compiled successfully!")
        # Run the graph
        print("Running the graph with user form submission...", user_form_submission)
        res = graph.invoke(user_form_submission)
        print("Graph run successfully!")

        return res
