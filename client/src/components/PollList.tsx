import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PollListData } from "../types"; // <-- IMPORT FROM THE NEW TYPES FILE

const PollList = () => {
  // State to store the list of polls fetched from the API
  const [polls, setPolls] = useState<PollListData[]>([]);
  // State to handle the loading status while we fetch data
  const [loading, setLoading] = useState<boolean>(true);
  // State to store any potential error messages
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to perform the data fetch when the component mounts
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/polls");
        if (!response.ok) {
          throw new Error("Data could not be fetched!");
        }
        const data: PollListData[] = await response.json();
        setPolls(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []); // The empty dependency array [] means this effect runs only once

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
