import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Define a TypeScript interface for the shape of our poll data
// This should match the data sent by our backend API
interface Poll {
  id: number;
  question: string;
}

const PollList = () => {
  // State to store the list of polls fetched from the API
  const [polls, setPolls] = useState<Poll[]>([]);
  // State to handle the loading status while we fetch data
  const [loading, setLoading] = useState<boolean>(true);
  // State to store any potential error messages
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to perform the data fetch when the component mounts
  useEffect(() => {
    // Define an async function inside the effect to fetch data
    const fetchPolls = async () => {
      try {
        // The URL of our backend endpoint
        const response = await fetch("http://localhost:3001/api/v1/polls");
        if (!response.ok) {
          throw new Error("Data could not be fetched!");
        }
        const data: Poll[] = await response.json();
        setPolls(data); // Update the state with the fetched polls
      } catch (error: any) {
        setError(error.message); // Store any error message in state
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchPolls();
  }, []); // The empty dependency array [] means this effect runs only once when the component mounts

  // Conditional rendering based on the state
  if (loading) {
    return <div>Loading polls...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Polls</h1>
      <ul>
        {polls.map((poll) => (
          <li key={poll.id}>
            <Link to={`/poll/${poll.id}`}>{poll.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollList;
