"use client";

import { useEffect, useState } from "react";
import { generate } from "random-words";
import { GameState, MatchStatus, MatchState, GuessState } from "@/app/types";
import { Letter } from "@/app/components/Letter";
import useKeyHandler from "@/app/hooks/useKeyHandler";
import { Keyboard } from "./Keyboard";

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

  const { handleClick } = useKeyHandler({
    setAttempts,
    currentGuess,
    gameState,
    attempts,
    setCurrentGuess,
    status,
  });

  useEffect(() => {
    const correct: string = generate({ minLength: 5, maxLength: 5 }) as string;
    const correctArray = correct.toUpperCase().split("");
    setGameState((prev) => ({ ...prev, solution: correctArray }));
    console.log("Correct answer is:", correct);
  }, []);

  return (
    <div className="flex flex-col place-items-center justify-center">
      <div className="flex items-center m-3">
        <h1>Arthur&apos;s Wordle</h1>
        <button
          className="absolute right-1 text-white bg-blue-500 px-4 py-2 rounded-md"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
      <div className="space-y-2 m-3">
        {attempts.map((guess, index) => (
          <div className="flex space-x-2" key={index}>
            {guess.letters.map((val, index) => (
              <Letter key={index} letter={val} />
            ))}
          </div>
        ))}
      </div>
      {status === MatchStatus.Lost && (
        <div>You lost, the word was: {gameState.solution.join("")}</div>
      )}
      {status === MatchStatus.Won && <div>Winner, winner, chicken dinner!</div>}
      <Keyboard handleClick={handleClick} />
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

const handleRefresh = () => {
  window.location.reload();
};
