"use client"; // Marca este componente como um Client Component devido ao uso de estado e interatividade

import { useState, useCallback } from "react";
import Link from "next/link";
import { PollDetailData, Option } from "@my-app/types";
import VoteButton from "./VoteButton";
import PageTitle from "./PageTitle";

// O componente recebe os dados iniciais do Server Component pai
interface PollDetailProps {
  initialPoll: PollDetailData;
}

const PollDetail = ({ initialPoll }: PollDetailProps) => {
  // O estado é inicializado com os dados do servidor, eliminando a necessidade de um fetch inicial no cliente
  const [poll, setPoll] = useState<PollDetailData>(initialPoll);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [lastVotedOption, setLastVotedOption] = useState<number | null>(null);

  // Função para ir buscar os dados atualizados da sondagem após um voto
  const fetchPollDetail = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/polls/${poll.id}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Poll could not be re-fetched!");
      }
      const data: PollDetailData = await response.json();
      setPoll(data); // Atualiza o estado com os novos dados
    } catch (err: any) {
      setError(err.message);
    }
  }, [poll.id]); // A dependência é o ID da sondagem

  // Função para lidar com o clique no botão de voto
  const handleVote = async (optionId: number) => {
    setIsVoting(true);
    setError(null);
    setLastVotedOption(null);

    try {
      await fetch(`http://localhost:3001/api/v1/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

      // Após o voto ser registado com sucesso, vai buscar os dados atualizados
      await fetchPollDetail();
      setLastVotedOption(optionId); // Guarda a última opção votada para o efeito visual
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVoting(false);
    }
  };

  // Renderização de erro ou se a sondagem não for encontrada
  if (error) return <div>Error: {error}</div>;
  if (!poll) return <div>Poll not found.</div>;

  // Calcula o total de votos para determinar as percentagens
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return (
    <div className="text-left">
      <PageTitle title={poll.question} />

      <div className="mb-8 text-left">
        <Link
          href="/"
          className="text-text-secondary no-underline transition-colors duration-200 ease-in-out hover:text-primary hover:underline"
        >
          ← Back to All Polls
        </Link>
      </div>

      <div className="list-none p-0 my-8 flex flex-col gap-6">
        {poll.options.map((option: Option) => {
          const percentage =
            totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

          // Efeito de "highlight" simples para a opção votada
          const highlightClass =
            lastVotedOption === option.id
              ? "animate-pulse" // Um efeito de pulsação temporário
              : "";

          return (
            <div
              key={option.id}
              className={`flex flex-col gap-2 ${highlightClass}`}
            >
              <div className="text-base font-medium text-text-primary">
                {option.option_text}
                <span className="text-text-secondary text-sm ml-2">
                  ({option.votes} votes)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-grow h-7 bg-gray-800 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-variant to-primary transition-all duration-500 ease-in-out flex items-center justify-start pl-3 box-border text-gray-200 text-xs font-semibold whitespace-nowrap"
                    style={{ width: `${percentage}%` }}
                  >
                    {/* Só mostra a percentagem se houver espaço suficiente */}
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
