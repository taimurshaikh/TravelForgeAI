import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/task-status/${taskId}`
        );
        if (response.data.state === "SUCCESS") {
          setResult(response.data.result);
          setLoading(false);
        } else {
          setTimeout(fetchResults, 2000);
        }
      } catch (error) {
        console.error("Error fetching task status", error);
      }
    };

    fetchResults();
  }, [taskId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="w-full max-w-lg mx-auto p-4 mt-20">
        {loading ? (
          <p className="text-xl font-semibold">Loading itinerary...</p>
        ) : (
          <pre className="bg-white p-4 rounded shadow-md">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
};

export default ResultsPage;
