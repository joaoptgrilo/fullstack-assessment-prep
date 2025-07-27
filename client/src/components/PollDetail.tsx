import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PollDetailData } from "../types"; // <-- IMPORT FROM THE NEW TYPES FILE

const PollDetail = () => {
  // useParams hook from react-router-dom to get URL parameters
  const { id } = useParams<{ id: string }>();

  // State for the poll data, loading status, and errors
  const [poll, setPoll] = useState<PollDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPollDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/polls/${id}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Poll could not be fetched!");
        }
        const data: PollDetailData = await response.json();
        setPoll(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPollDetail();
    }
  }, [id]); // The effect re-runs if the 'id' from the URL changes

  if (loading) {
    return <div>Loading poll details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!poll) {
    return <div>Poll not found.</div>;
  }

  return (
    <div>
      <h2>{poll.question}</h2>
      <ul>
        {poll.options.map((option) => (
          <li key={option.id}>
            {option.option_text} - (Votes: {option.votes})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollDetail;
