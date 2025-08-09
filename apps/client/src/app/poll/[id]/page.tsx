import PollDetail from "@/components/PollDetail";
import { PollDetailData } from "@my-app/types";

interface PollDetailPageProps {
  params: {
    id: string;
  };
}

async function getPoll(id: string): Promise<PollDetailData> {
  const res = await fetch(`http://localhost:3001/api/v1/polls/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch poll with id: ${id}`);
  }

  return res.json();
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  const poll = await getPoll(params.id);

  return <PollDetail initialPoll={poll} />;
}
