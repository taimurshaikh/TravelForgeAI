from pydantic import BaseModel


class ItineraryRequest(BaseModel):
    location: str
    time_range: str
    budget: str
    accommodation_type: str
    num_days: int
    interests: list[str]
