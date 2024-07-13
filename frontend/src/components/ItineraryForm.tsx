import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ItineraryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    time_range: "",
    budget: "",
    accomodation_type: "",
    num_days: 0,
    interests: [] as string[],
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const newInterests = checked
        ? [...prevData.interests, value]
        : prevData.interests.filter((interest) => interest !== value);
      return { ...prevData, interests: newInterests };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-itinerary",
        formData
      );
      const { task_id } = response.data;
      navigate("/results", { state: { taskId: task_id } });
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <form className="max-w-lg mx-auto p-4" onSubmit={handleSubmit}>
      <main className="w-full max-w-lg mx-auto p-4 mt-20">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="city"
          >
            City
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="country"
          >
            Country
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="time_range"
          >
            Time Range
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="time_range"
            name="time_range"
            type="text"
            value={formData.time_range}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="budget"
          >
            Budget
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="budget"
            name="budget"
            type="text"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="accomodation_type"
          >
            Accommodation Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="accomodation_type"
            name="accomodation_type"
            type="text"
            value={formData.accomodation_type}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="num_days"
          >
            Number of Days
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="num_days"
            name="num_days"
            type="number"
            value={formData.num_days}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Interests
          </label>
          {["museums", "parks", "shopping"].map((interest) => (
            <div key={interest} className="flex items-center mb-2">
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                name="interests"
                value={interest}
                checked={formData.interests.includes(interest)}
                onChange={handleCheckboxChange}
              />
              <label className="text-gray-700">{interest}</label>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </main>
    </form>
  );
};

export default ItineraryForm;
