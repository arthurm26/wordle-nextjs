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
    attempts: attempts,
    currentNumGuess: 1,
    maxNumGuesses: 6,
    status: MatchStatus.Playing,
  });
  //   (event: KeyboardEvent) => {
  //     if (event.key === "Backspace") {
  //       setAttempts((prevAttempts) => {
  //         const firstEmptyLetterIdx = prevAttempts[
  //           currentGuess
  //         ].letters.findIndex((idx) => idx.letter === "");

  //         const lastLetterIdx =
  //           firstEmptyLetterIdx === -1 ? 4 : firstEmptyLetterIdx - 1;

  //         const updatedCurrentGuess = prevAttempts[currentGuess].letters.map(
  //           (letter, index) => {
  //             if (lastLetterIdx === index) {
  //               return { ...letter, letter: "" };
  //             }
  //             return letter;
  //           },
  //         );
  //         return prevAttempts.map((attempt, index) =>
  //           index === currentGuess
  //             ? { ...attempt, letters: updatedCurrentGuess }
  //             : attempt,
  //         );
  //       });
  //     }

  //     if (event.key.match(/^[a-z]$/i)) {
  //       setAttempts((prevAttempts) => {
  //         const firstEmptyLetterIdx = prevAttempts[
  //           currentGuess
  //         ].letters.findIndex((idx) => idx.letter === "");

  //         const updatedCurrentGuess = prevAttempts[currentGuess].letters.map(
  //           (letter, index) => {
  //             if (firstEmptyLetterIdx == index) {
  //               return { ...letter, letter: event.key.toUpperCase() };
  //             }
  //             return letter;
  //           },
  //         );

  //         return prevAttempts.map((attempt, index) =>
  //           index === currentGuess
  //             ? { ...attempt, letters: updatedCurrentGuess }
  //             : attempt,
  //         );
  //       });
  //       return;
  //     }

  //     if (attempts[currentGuess].letters.some((e) => e.letter === "")) return;

  //     if (event.key === "Enter") {
  //       setAttempts((prevAttempts) => {
  //         const updatedLetters = prevAttempts[currentGuess].letters.map(
  //           (letter, index) => {
  //             if (letter.letter === gameState.solution[index]) {
  //               return { ...letter, match: MatchState.Correct };
  //             }
  //             if (!gameState.solution.includes(letter.letter)) {
  //               return { ...letter, match: MatchState.Incorrect };
  //             }
  //             if (gameState.solution.includes(letter.letter)) {
  //               return { ...letter, match: MatchState.Almost };
  //             }
  //             return { ...letter };
  //           },
  //         );
  //         prevAttempts[currentGuess] = {
  //           ...prevAttempts[currentGuess],
  //           letters: updatedLetters,
  //         };
  //         return prevAttempts;
  //       });
  //       setCurrentGuess((prevCurrentGuess) => {
  //         return (prevCurrentGuess += 1);
  //       });
  //     }
  //   },
  //   [gameState, attempts, currentGuess],
  // );

  useKeyHandler({
    setAttempts,
    currentGuess,
    gameState,
    attempts,
    setCurrentGuess,
  });

  useEffect(() => {
    if (currentGuess === 0) return;

    const previousGuess = attempts[currentGuess - 1];

    if (!previousGuess) return;

    const allCorrect = previousGuess.letters.every(
      (ltr) => ltr.match === "correct",
    );

    if (allCorrect) {
      setGameState((prevGameState) => ({
        ...prevGameState,
        status: MatchStatus.Won,
      }));
    } else if (currentGuess === maxNumGuesses) {
      setGameState((prevGameState) => ({
        ...prevGameState,
        status: MatchStatus.Lost,
      }));
    }
  }, [attempts, currentGuess]);

  useEffect(() => {
    const correct = generate({ minLength: 5, maxLength: 5 }) as string;
    const correctArray = correct.toUpperCase().split("");
    setGameState((prev) => ({ ...prev, solution: correctArray }));
    console.log("Correct answer is:", correct);
  }, []);
  //   if (gameState.status !== "playing") return;

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [gameState.status, handleKeyDown]);

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
      {gameState.status === MatchStatus.Lost && (
        <div>You lost, the word was: {gameState.solution.join("")}</div>
      )}
      {gameState.status === MatchStatus.Won && (
        <div>Winner, winner, chicken dinner!</div>
      )}
    </div>
  );
}
