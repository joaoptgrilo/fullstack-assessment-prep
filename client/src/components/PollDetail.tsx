import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { PollDetailData, Option } from "../types";
import VoteButton from "./VoteButton";
import styles from "./PollDetail.module.css";
import PageTitle from "./PageTitle";

const PollDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [poll, setPoll] = useState<PollDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [lastVotedOption, setLastVotedOption] = useState<number | null>(null);

  const fetchPollDetail = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/polls/${id}`);
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
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPollDetail();
    }
  }, [fetchPollDetail, id]);

  const handleVote = async (optionId: number) => {
    setIsVoting(true);
    setError(null);
    setLastVotedOption(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/polls/${id}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ optionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register vote.");
      }

      await fetchPollDetail();
      setLastVotedOption(optionId);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) return <div>Loading poll details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!poll) return <div>Poll not found.</div>;

  return (
    <div className={styles.pollDetail}>
      <PageTitle title={poll.question} />

      <div className={styles.backLinkContainer}>
        <Link to="/" className={styles.backLink}>
          ← Back to All Polls
        </Link>
      </div>

      <ul className={styles.optionsList}>
        {poll.options.map((option: Option) => (
          <li
            key={option.id}
            className={`${styles.optionItem} ${
              lastVotedOption === option.id ? styles.highlight : ""
            }`}>
            <span className={styles.optionText}>
              {option.option_text}
              <span className={styles.voteCount}>
                {" "}
                - (Votes: {option.votes})
              </span>
            </span>
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
