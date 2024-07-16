import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import BudgetSelector from "./BudgetSelector";
import { StylizedButton } from "./StylizedButton";

/**
 * Represents the structure of the form data.
 */
interface FormData {
  location: string;
  time_range: string;
  budget: string;
  accomm_type: string;
  num_days: number;
  interests: string[];
}

/**
 * Represents the structure of form validation errors.
 */
interface Errors {
  location?: string;
  time_range?: string;
  budget?: string;
  accomm_type?: string;
  num_days?: string;
  interests?: string;
  submit?: string;
}

/**
 * ItineraryForm component for creating a travel itinerary.
 * @returns {JSX.Element} The rendered form
 */
const ItineraryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    location: "",
    time_range: "",
    budget: "",
    accomm_type: "",
    num_days: 0,
    interests: ["", "", ""],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  /**
   * Handles changes in form inputs.
   * @param {ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - The change event
   */
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

  /**
   * Handles changes in interest inputs.
   * @param {number} index - The index of the interest input
   * @param {string} value - The new value of the interest input
   */
  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value;
    setFormData((prev) => ({ ...prev, interests: newInterests }));
  };

  /**
   * Maps budget symbol to a descriptive term.
   * @param {string} budget - The budget symbol
   * @returns {string} The descriptive term for the budget
   */
  const mapBudgetToTerm = (budget: string): string => {
    switch (budget) {
      case "$":
        return "cheap";
      case "$$":
        return "medium price";
      case "$$$":
        return "luxury";
      default:
        return "";
    }
  };

  /**
   * Validates the form data.
   * @returns {boolean} True if the form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.time_range) newErrors.time_range = "Time range is required";
    if (!formData.budget) newErrors.budget = "Budget is required";
    if (!formData.accomm_type)
      newErrors.accomm_type = "Accommodation type is required";
    if (formData.num_days <= 0)
      newErrors.num_days = "Number of days must be greater than 0";

    const validInterests = formData.interests.filter(
      (interest) => interest.trim() !== ""
    );
    if (validInterests.length === 0) {
      newErrors.interests = "At least one interest is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission.
   * @param {FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const validInterests = formData.interests.filter(
        (interest) => interest.trim() !== ""
      );
      const mappedBudget = mapBudgetToTerm(formData.budget);
      console.log("Submitting form with data", {
        ...formData,
        interests: validInterests,
        budget: mappedBudget,
      });
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-itinerary",
        {
          ...formData,
          location: formData.location ?? "",
          interests: validInterests,
          budget: mappedBudget,
        }
      );
      const { task_id } = response.data;
      navigate(`/results/${task_id}`);
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
        {/* Form fields */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="location"
          >
            Location
          </label>
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
          {errors.location && (
            <p className="text-red-500 text-xs italic">{errors.location}</p>
          )}
        </div>

        {/* Time of Travel */}
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

        {/* Budget */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Budget
          </label>
          <BudgetSelector value={formData.budget} onChange={handleChange} />
          {errors.budget && (
            <p className="text-red-500 text-xs italic">{errors.budget}</p>
          )}
        </div>

        {/* Accommodation Type */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="accomm_type"
          >
            Accommodation Type
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.accomm_type ? "border-red-500" : ""
            }`}
            id="accomm_type"
            name="accomm_type"
            value={formData.accomm_type}
            onChange={handleChange}
          >
            <option value="">Select accommodation type</option>
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="apartment">Apartment</option>
            <option value="camping">Camping</option>
            <option value="resort">Resort</option>
          </select>
          {errors.accomm_type && (
            <p className="text-red-500 text-xs italic">{errors.accomm_type}</p>
          )}
        </div>

        {/* Number of Days */}
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
            min="1"
            placeholder="1"
          />
          {errors.num_days && (
            <p className="text-red-500 text-xs italic">{errors.num_days}</p>
          )}
        </div>

        {/* Interests */}
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
          <StylizedButton
            text="Generate Itinerary"
            color="blue"
            extraClasses="w-full px-8 py-2"
          />
        </div>
      </main>
    </form>
  );
};

export default ItineraryForm;
