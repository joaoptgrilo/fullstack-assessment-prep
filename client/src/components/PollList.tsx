import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PollListData } from "@my-app/types";
import styles from "./PollList.module.css";
import PageTitle from "./PageTitle";

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
      <PageTitle title="All Polls" />
      <ul className={styles.pollList}>
        {polls.map((poll) => (
          <li key={poll.id} className={styles.pollItem}>
            <Link to={`/poll/${poll.id}`} className={styles.pollLink}>
              {poll.question}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollList;
