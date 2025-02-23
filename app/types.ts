export type GameState = {
  solution: string[];
  attempts: GuessState[];
  currentNumGuess: number;
  maxNumGuesses: number;
  status: MatchStatus;
};

export enum MatchStatus {
  Playing = "playing",
  Won = "won",
  Lost = "lost",
}

export enum MatchState {
  Unknown = "unknown",
  Correct = "correct",
  Incorrect = "incorrect",
  Almost = "almost",
}

export type GuessState = {
  letters: LetterState[];
};

export type LetterState = {
  letter: string;
  match: MatchState;
};
