import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PollDetailData, Option } from "../types";
import VoteButton from "./VoteButton"; // <-- Import the VoteButton component

const PollDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [poll, setPoll] = useState<PollDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // *** NEW STATE ***
  // Add a new state to track when a vote is being submitted
  const [isVoting, setIsVoting] = useState<boolean>(false);

  // This function will be called by the VoteButton
  const handleVote = async (optionId: number) => {
    setIsVoting(true); // Disable buttons
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/polls/${id}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ optionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register vote.");
      }

      // NOTE: The UI update logic will be handled in the next task (Task #15)
      // For now, we'll just log a success message.
      console.log("Vote registered successfully!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsVoting(false); // Re-enable buttons
    }
  };

  // The useEffect hook for fetching poll details remains the same
  useEffect(() => {
    const fetchPollDetail = async () => {
      // ... (keep the existing fetchPollDetail function as is)
      setLoading(true);
      setError(null);
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
  }, [id]);

  if (loading) return <div>Loading poll details...</div>;
  // Show a more specific error message if the vote fails
  if (error) return <div>Error: {error}</div>;
  if (!poll) return <div>Poll not found.</div>;

  return (
    <div>
      <h2>{poll.question}</h2>
      <ul>
        {poll.options.map((option: Option) => (
          <li key={option.id}>
            {option.option_text} - (Votes: {option.votes})
            {/* Render the VoteButton for each option */}
            <VoteButton
              optionText={option.option_text}
              onVote={() => handleVote(option.id)}
              disabled={isVoting}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollDetail;
