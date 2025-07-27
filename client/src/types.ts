/**
 * This file contains the TypeScript type definitions for the data structures
 * used throughout the client-side application.
 */

// Interface for a single option within a poll
export interface Option {
  id: number;
  option_text: string;
  votes: number;
}

export interface PollDetailData {
  id: number;
  question: string;
  options: Option[];
}

export interface PollListData {
  id: number;
  question: string;
}
