import { useState, useEffect } from "react";
import axios from "axios";
import { ApiResponse } from "types";

/**
 * Custom hook to fetch task results from the API.
 *
 * @param {string | undefined} taskId - The ID of the task to fetch results for
 * @returns {{ loading: boolean, result: ApiResponse | null, error: string | null }}
 *          An object containing the loading state, result data, and any error message
 */
const useTaskResults = (taskId: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setError("No task ID provided");
      setLoading(false);
      return;
    }

    /**
     * Fetches the task results from the API.
     * Implements a polling mechanism for pending tasks.
     */
    const fetchResults = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `http://127.0.0.1:8000/task-status/${taskId}`
        );

        if (response.data.state === "SUCCESS") {
          setResult(response.data);
          setLoading(false);
        } else if (response.data.state === "PENDING") {
          setTimeout(fetchResults, 2000); // Retry after 2 seconds
        } else {
          throw new Error("Task failed or not found");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`Network error: ${error.message}`);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    fetchResults();
  }, [taskId]);

  return { loading, result, error };
};

export default useTaskResults;
