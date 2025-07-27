import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PollListData } from "../types";

const PollList = () => {
  const [polls, setPolls] = useState<PollListData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  if (loading) return <div>Loading polls...</div>;
  if (error) return <div>Error: {error}</div>;

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
