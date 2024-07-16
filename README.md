# TravelForge ✈️⚒️

TravelForge is an AI-powered travel itinerary generator designed to create personalized travel plans tailored to your unique preferences. TravelForge leverages multi-agent workflows to streamline the travel planning process, ensuring you get a customized and enjoyable travel experience.

## 🤖 Agents Overview

We use the [LangGraph Library](https://github.com/langchain-ai/langgraph) to design our agentic workflow. The following agents work together to create a seamless and personalized travel itinerary:

1. **Researcer**: Gathers information about destinations, attractions, accommodations, and more.
2. **Recommender**: Suggests activities and accommodations options based on user preferences and interests upon recieving the research results.
3. **Itinerary Generator**: Creates a detailed itinerary based on the user's preferences and the recommendations provided by the Recommender.
4. **Itinerary Formatter**: Formats the API's response for presentation and delivery to the user.
5. **(WIP) Feedback Agent**: Collects user feedback on the itinerary and makes adjustments based on the feedback.
6. **(WIP) Mapper**: Generates an interactive map of all the sites and activities in the itinerary for the user to explore.

## 🎥 Demo

https://github.com/taimurshaikh/travelforge/assets/demo/travelforge-demo.mp4

## 🌟 Features

- **Personalized Itineraries**: Create travel plans that align with your interests and preferences.
- **Comprehensive Planning**: Includes details on attractions, accommodations, dining, and activities.
- **Engaging Design**: Enjoy a visually appealing and well-organized itinerary layout.
- **Quality Assurance**: Iterative feedback and refinement ensure a satisfying travel plan.
- **User-Friendly Interface**: Easy-to-use platform for setting preferences and generating itineraries.

## 🛠️ How It Works

1. **Setting Preferences**: Users input their travel interests, preferred destinations, and travel dates.
2. **Automated Curation**: The Research Agent gathers information on destinations, attractions, accommodations, and activities.
3. **Itinerary Creation**: The Recommender Agent suggests activities and accommodations based on user preferences, and the Itinerary Generator creates a detailed itinerary.
4. **Delivery**: The Itinerary Formatter formats the itinerary for presentation and delivery to the user.

## 🗂️ Installation

You will need API keys from both [Tavily](https://tavily.com) and [OpenAI](https://openai.com) to run the app. You can sign up for a free account on their respective websites to get your API keys.

1. Clone the repo
   ```sh
   git clone https://github.com/taimurshaikh/travelforge.git
   ```
2. Export your API Keys
   ```sh
   export TAVILY_API_KEY=<YOUR_TAVILY_API_KEY>
   export OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
   ```
   ...OR add them to an `.env` file in the root directory
   ```sh
    TAVILY_API_KEY=<YOUR_TAVILY_API_KEY>
    OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
   ```
3. The simplest way to start the app is to run the shell script in the root directory. First, ensure the script is executable:
   ```sh
   chmod +x start.sh
   ```
   Then run the script:
   ```sh
   ./startup-script.sh
   ```
4. The app should now be running on `http://localhost:5173`.
5. Start planning your next adventure ✈️ ✈️ ✈️!

## 🛣️ Roadmap

Checklist of features and functionalities that are planned for future releases. These will be turned into GitHub milestones in the future.
[ ] **Docker Support**: Finish dockerizing the application for easy deployment and scaling.
[ ] **Feedback Agent**: Collect user feedback on the itinerary and make adjustments based on the feedback.
[ ] **Mapper**: Generate an interactive map of all the sites and activities in the itinerary for the user to explore.
[ ] **Multi-User Support**: Allow multiple users to create and manage their travel itineraries.
[ ] **Collaborative Planning**: Enable users to share and collaborate on travel plans with friends and family.
[ ] **Mobile App**: Look into developing a mobile app version of TravelForge for on-the-go travel planning.

## ❗Known Issues

These will be migrated to the issues tab in the future.

- **Docker Support**: Docker support is still a work in progress. There is an open bug with the frontend Dockerfile not including the packages for building to all targets (see [this issue](https://github.com/vitejs/vite/discussions/15532))that needs to be resolved.
- **Accomodation Images**: The current algorithm for matching the images returned by the Researcher's Tavily Request to the accomodations is a heuristic, and sometimes leads to incorrect images being displayed for a given accomodation.
- **Days with No Activities**: Depending on the OpenAI call, there may be days where no activities are suggested. This is a known issue and will be addressed in future releases.

## 🤝 Contributing

Interested in contributing to TravelForge? We welcome contributions of all kinds! Check out our [Contributor's Guide](CONTRIBUTING.md) to get started.

## 📩 Contact Us

For support or inquiries, please reach out to us:

- [Email](mailto:taimurshaikh@example.com)

Join us in revolutionizing the travel planning experience with TravelForge!

## 🙏 Sources and Acknowledgements

[Tavily](https://tavily.com)
[OpenAI](https://openai.com)
[LangGraph](https://langchain-ai.github.io/langgraph/)
[LangChain](https://www.langchain.com/)

We would like to thank the team at Tavily for providing inspiration for this project as part of their take-home challenge.
