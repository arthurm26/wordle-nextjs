"use client";

import { useEffect, useState } from "react";
import { generate } from "random-words";
import { GameState, MatchStatus, MatchState, GuessState } from "@/app/types";
import { Guess } from "@/app/components/Guess";
import useKeyHandler from "./hooks/useKeyHandler";

const maxNumGuesses = 6;

export default function Wordle() {
  const [attempts, setAttempts] = useState<GuessState[]>(
    new Array(maxNumGuesses).fill({
      letters: [
        { letter: "", match: MatchState.Unknown },
        { letter: "", match: MatchState.Unknown },
        { letter: "", match: MatchState.Unknown },
        { letter: "", match: MatchState.Unknown },
        { letter: "", match: MatchState.Unknown },
      ],
    }),
  );
  const [currentGuess, setCurrentGuess] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>({
    solution: [],
    currentNumGuess: 1,
    maxNumGuesses: 6,
  });

  const status = getGameStatus({ attempts, currentGuess });

  useKeyHandler({
    setAttempts,
    currentGuess,
    gameState,
    attempts,
    setCurrentGuess,
    status,
  });

  useEffect(() => {
    const correct = generate({ minLength: 5, maxLength: 5 }) as string;
    const correctArray = correct.toUpperCase().split("");
    setGameState((prev) => ({ ...prev, solution: correctArray }));
    console.log("Correct answer is:", correct);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-2 m-2">
      <h1>Wordle</h1>
      <div className="space-y-4">
        {attempts.map((guess, index) => (
          <div className="flex space-x-4" key={index}>
            {guess.letters.map((val, index) => (
              <Guess key={index} letter={val} />
            ))}
          </div>
        ))}
      </div>
      {status === MatchStatus.Lost && (
        <div>You lost, the word was: {gameState.solution.join("")}</div>
      )}
      {status === MatchStatus.Won && <div>Winner, winner, chicken dinner!</div>}
    </div>
  );
}

function getGameStatus({
  attempts,
  currentGuess,
}: {
  attempts: GuessState[];
  currentGuess: number;
}): MatchStatus {
  if (currentGuess === 0) return MatchStatus.Playing;

  const previousGuess = attempts[currentGuess - 1];

  if (!previousGuess) return MatchStatus.Playing;

  const allCorrect = previousGuess.letters.every(
    (ltr) => ltr.match === "correct",
  );

  if (allCorrect) {
    return MatchStatus.Won;
  } else if (currentGuess === maxNumGuesses) {
    return MatchStatus.Lost;
  }
  return MatchStatus.Playing;
}
