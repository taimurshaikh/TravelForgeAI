from pydantic import BaseModel


class ItineraryRequest(BaseModel):
    location: str
    time_range: str
    budget: str
    accomm_type: str
    num_days: int
    interests: list[str]
