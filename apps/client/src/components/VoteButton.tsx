interface VoteButtonProps {
  onVote: () => void;
  disabled: boolean;
}

const VoteButton = ({ onVote, disabled }: VoteButtonProps) => {
  return (
    <button
      onClick={onVote}
      disabled={disabled}
      // Estilos do Tailwind aplicados diretamente
      className="py-2 px-4 text-sm font-semibold text-gray-900 bg-primary border-none rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:enabled:bg-purple-400 hover:enabled:-translate-y-px disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
    >
      Vote
    </button>
  );
};

export default VoteButton;
