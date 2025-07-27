interface VoteButtonProps {
  optionText: string;
  onVote: () => void;
  disabled: boolean;
}

const VoteButton = ({ optionText, onVote, disabled }: VoteButtonProps) => {
  return (
    <button onClick={onVote} disabled={disabled} className="voteButton">
      Vote for "{optionText}"
    </button>
  );
};

export default VoteButton;
