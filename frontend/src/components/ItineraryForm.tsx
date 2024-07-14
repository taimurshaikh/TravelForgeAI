import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingEllipsis from "./LoadingEllipsis";

import BudgetSelector from "./BudgetSelector";

interface FormData {
  location: string;
  time_range: string;
  budget: string;
  accommodation_type: string;
  num_days: number;
  interests: string[];
}

interface Errors {
  location?: string;
  time_range?: string;
  budget?: string;
  accommodation_type?: string;
  num_days?: string;
  interests?: string;
  submit?: string;
}

const ItineraryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    location: "",
    time_range: "",
    budget: "",
    accommodation_type: "",
    num_days: 0,
    interests: ["museums", "parks", "shopping"],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleApiAvailable, setIsGoogleApiAvailable] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "num_days" ? parseInt(value, 10) : value,
    }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value.trim();
    setFormData((prev) => ({ ...prev, interests: newInterests }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.time_range) newErrors.time_range = "Time range is required";
    if (!formData.budget) newErrors.budget = "Budget is required";
    if (!formData.accommodation_type)
      newErrors.accommodation_type = "Accommodation type is required";
    if (formData.num_days <= 0)
      newErrors.num_days = "Number of days must be greater than 0";
    if (!formData.interests)
      newErrors.interests = "At least one interest is required";
    const validInterests = formData.interests.filter(
      (interest) => interest.trim() !== ""
    );
    if (validInterests.length === 0) {
      newErrors.interests = "At least one interest is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const validInterests = formData.interests.filter(
        (interest) => interest.trim() !== ""
      );
      console.log("Submitting form with data", {
        ...formData,
        interests: validInterests,
      });
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-itinerary",
        {
          ...formData,
          location: formData.location ?? "",
          interests: validInterests,
        }
      );
      const { task_id } = response.data;
      navigate(`/results/${task_id}`);
      //navigate("/results", { state: { taskId: task_id } });
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit form. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="max-w-lg mx-auto p-4" onSubmit={handleSubmit}>
      <main className="w-full max-w-lg mx-auto p-4 mt-20">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <div>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.location ? "border-red-500" : ""
              }`}
              id="location"
              name="location"
              type="text"
              value={formData.location ?? ""}
              onChange={(e) => handleChange(e as ChangeEvent<HTMLInputElement>)}
              placeholder="e.g. Paris, France"
            />
          </div>

          {errors.location && (
            <p className="text-red-500 text-xs italic">{errors.location}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="time_range"
          >
            Time of Travel
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.time_range ? "border-red-500" : ""
            }`}
            id="time_range"
            name="time_range"
            type="text"
            value={formData.time_range}
            onChange={handleChange}
            placeholder="e.g. Summer"
          />
          {errors.time_range && (
            <p className="text-red-500 text-xs italic">{errors.time_range}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Budget
          </label>
          <BudgetSelector value={formData.budget} onChange={handleChange} />
          {errors.budget && (
            <p className="text-red-500 text-xs italic">{errors.budget}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="accommodation_type"
          >
            Accommodation Type
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.accommodation_type ? "border-red-500" : ""
            }`}
            id="accommodation_type"
            name="accommodation_type"
            value={formData.accommodation_type}
            onChange={handleChange}
          >
            <option value="">Select accommodation type</option>
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="apartment">Apartment</option>
            <option value="camping">Camping</option>
            <option value="resort">Resort</option>
          </select>
          {errors.accommodation_type && (
            <p className="text-red-500 text-xs italic">
              {errors.accommodation_type}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="num_days"
          >
            Number of Days
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.num_days ? "border-red-500" : ""
            }`}
            id="num_days"
            name="num_days"
            type="number"
            value={formData.num_days}
            onChange={handleChange}
            placeholder="e.g., 7"
          />
          {errors.num_days && (
            <p className="text-red-500 text-xs italic">{errors.num_days}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Interests (up to 3)
          </label>
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 ${
                errors.interests ? "border-red-500" : ""
              }`}
              type="text"
              value={formData.interests[index]}
              onChange={(e) => handleInterestChange(index, e.target.value)}
              placeholder={`Interest ${index + 1}`}
            />
          ))}
          {errors.interests && (
            <p className="text-red-500 text-xs italic">{errors.interests}</p>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm italic mb-4">{errors.submit}</p>
        )}

        <div className="flex items-center justify-between">
          <button
            className={`w-full px-8 py-2 rounded overflow-hidden border border-[#4E1A70] bg-slate-50 text-[#4E1A70] shadow-2xl
          relative transition-all duration-500 ease-in-out hover:text-slate-50 group ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
            type="submit"
            disabled={isLoading}
          >
            <span className="relative z-10 text-base">
              {isLoading ? (
                <span>
                  Generating <LoadingEllipsis />
                </span>
              ) : (
                "Generate Itinerary"
              )}
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded transition-all duration-300 group-hover:scale-100">
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#4E1A70] to-[#2B4CF2]"></div>
            </div>
          </button>
        </div>
      </main>
    </form>
  );
};

export default ItineraryForm;
