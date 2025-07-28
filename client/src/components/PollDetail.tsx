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
    setLoading(true);
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
      await fetch(`http://localhost:3001/api/v1/polls/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

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

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return (
    <div className={styles.pollDetail}>
      <PageTitle title={poll.question} />

      <div className={styles.backLinkContainer}>
        <Link to="/" className={styles.backLink}>
          ← Back to All Polls
        </Link>
      </div>

      <div className={styles.optionsList}>
        {poll.options.map((option: Option) => {
          const percentage =
            totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

          return (
            <div
              key={option.id}
              className={`${styles.optionBlock} ${
                lastVotedOption === option.id ? styles.highlight : ""
              }`}>
              <div className={styles.optionLabel}>
                {option.option_text}
                <span className={styles.voteCount}>({option.votes})</span>
              </div>

              <div className={styles.barAndButtonWrapper}>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFiller}
                    style={{ width: `${percentage}%` }}>
                    {percentage > 15 && `${percentage.toFixed(0)}%`}
                  </div>
                </div>
                <VoteButton
                  onVote={() => handleVote(option.id)}
                  disabled={isVoting}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollDetail;
