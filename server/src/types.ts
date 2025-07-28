export interface Poll {
  id: number;
  question: string;
}
export interface Option {
  id: number;
  option_text: string;
  votes: number;
  poll_id: number;
}
