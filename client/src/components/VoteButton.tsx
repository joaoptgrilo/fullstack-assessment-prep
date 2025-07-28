interface VoteButtonProps {
  onVote: () => void;
  disabled: boolean;
}

const VoteButton = ({ onVote, disabled }: VoteButtonProps) => {
  return (
    <button onClick={onVote} disabled={disabled} className="voteButton">
      Vote
    </button>
  );
};

export default VoteButton;
