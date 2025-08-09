import PollList from "@/components/PollList";
import PageTitle from "@/components/PageTitle";
import { PollListData } from "@my-app/types";

async function getPolls(): Promise<PollListData[]> {
  const res = await fetch("http://localhost:3001/api/v1/polls", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch polls");
  }

  return res.json();
}

export default async function HomePage() {
  const polls = await getPolls();

  return (
    <>
      <PageTitle title="All Polls" />
      <PollList polls={polls} />
    </>
  );
}
