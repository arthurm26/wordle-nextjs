import { useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { GameState, GuessState, MatchState, MatchStatus } from "../types";

export default function useKeyHandler({
  setAttempts,
  currentGuess,
  gameState,
  attempts,
  setCurrentGuess,
  status,
}: {
  setAttempts: Dispatch<SetStateAction<GuessState[]>>;
  currentGuess: number;
  gameState: GameState;
  attempts: GuessState[];
  setCurrentGuess: Dispatch<SetStateAction<number>>;
  status: MatchStatus;
}) {
  const processInput = useCallback(
    (value: string) => {
      if (value === "Backspace") {
        setAttempts((prevAttempts) => {
          const firstEmptyLetterIdx = prevAttempts[
            currentGuess
          ].letters.findIndex((idx) => idx.letter === "");

          const lastLetterIdx =
            firstEmptyLetterIdx === -1 ? 4 : firstEmptyLetterIdx - 1;

          const updatedCurrentGuess = prevAttempts[currentGuess].letters.map(
            (letter, index) => {
              if (lastLetterIdx === index) {
                return { ...letter, letter: "" };
              }
              return letter;
            },
          );
          return prevAttempts.map((attempt, index) =>
            index === currentGuess
              ? { ...attempt, letters: updatedCurrentGuess }
              : attempt,
          );
        });
      }

      if (value.match(/^[a-z]$/i)) {
        setAttempts((prevAttempts) => {
          const firstEmptyLetterIdx = prevAttempts[
            currentGuess
          ].letters.findIndex((idx) => idx.letter === "");

          const updatedCurrentGuess = prevAttempts[currentGuess].letters.map(
            (letter, index) => {
              if (firstEmptyLetterIdx == index) {
                return { ...letter, letter: value.toUpperCase() };
              }
              return letter;
            },
          );

          return prevAttempts.map((attempt, index) =>
            index === currentGuess
              ? { ...attempt, letters: updatedCurrentGuess }
              : attempt,
          );
        });
        return;
      }

      if (attempts[currentGuess].letters.some((e) => e.letter === "")) return;

      if (value === "Enter") {
        setAttempts((prevAttempts) => {
          const updatedLetters = prevAttempts[currentGuess].letters.map(
            (letter, index) => {
              if (letter.letter === gameState.solution[index]) {
                return { ...letter, match: MatchState.Correct };
              }
              if (!gameState.solution.includes(letter.letter)) {
                return { ...letter, match: MatchState.Incorrect };
              }
              if (gameState.solution.includes(letter.letter)) {
                return { ...letter, match: MatchState.Almost };
              }
              return { ...letter };
            },
          );
          prevAttempts[currentGuess] = {
            ...prevAttempts[currentGuess],
            letters: updatedLetters,
          };
          return prevAttempts;
        });
        setCurrentGuess((prevCurrentGuess) => {
          return (prevCurrentGuess += 1);
        });
      }
    },
    [attempts, currentGuess, setAttempts, setCurrentGuess, gameState.solution],
  );

  useEffect(() => {
    if (status !== MatchStatus.Playing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      processInput(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status, processInput]);

  const handleClick = useCallback(
    (value: string) => {
      if (status !== MatchStatus.Playing) return;
      processInput(value);
    },
    [status, processInput],
  );

  return { handleClick };
}
