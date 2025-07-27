// Define the props that this component will accept
interface VoteButtonProps {
  optionText: string;
  onVote: () => void;
  disabled: boolean;
}

const VoteButton = ({ optionText, onVote, disabled }: VoteButtonProps) => {
  return (
    <button onClick={onVote} disabled={disabled} style={{ marginLeft: "1rem" }}>
      Vote for {optionText}
    </button>
  );
};

export default VoteButton;
