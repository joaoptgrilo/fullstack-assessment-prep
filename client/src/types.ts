/**
 * Shared TypeScript type definitions for the client application.
 */

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
