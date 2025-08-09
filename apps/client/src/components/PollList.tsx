"use client";

import Link from "next/link";
import { PollListData } from "@my-app/types";
// Remova: import styles from "./PollList.module.css";

interface PollListProps {
  polls: PollListData[];
}

const PollList = ({ polls }: PollListProps) => {
  if (!polls || polls.length === 0) {
    return <div>No polls found.</div>;
  }

  return (
    <ul className="list-none p-0 mt-8">
      {polls.map((poll, index) => (
        <li
          key={poll.id}
          // Adiciona borda a todos menos ao último item
          className={`border-border-color border-b ${
            index === 0 ? "border-t" : ""
          } transition-colors duration-200 ease-in-out`}
        >
          <Link
            href={`/poll/${poll.id}`}
            // Classes do Tailwind para o link
            className="block py-5 px-2 text-text-primary text-lg font-medium text-left no-underline cursor-pointer hover:bg-white/5 hover:text-primary transition-colors duration-200 ease-in-out"
          >
            {poll.question}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PollList;
