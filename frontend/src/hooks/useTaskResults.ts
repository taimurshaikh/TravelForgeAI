import { useState, useEffect } from "react";
import axios from "axios";
import { ApiResponse } from "types";

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

    const fetchResults = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `http://127.0.0.1:8000/task-status/${taskId}`
        );

        if (response.data.state === "SUCCESS") {
          setResult(response.data);
          setLoading(false);
        } else if (response.data.state === "PENDING") {
          setTimeout(fetchResults, 2000);
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
