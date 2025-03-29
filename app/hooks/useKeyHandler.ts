import { useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { GameState, GuessState, MatchState, MatchStatus } from "@/app/types";

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
          const evaluatedAttempt = evaluateAttempt(
            gameState.solution,
            prevAttempts,
            currentGuess,
          );

          return prevAttempts.map((attempt, index) =>
            index === currentGuess
              ? { ...attempt, letters: evaluatedAttempt }
              : attempt,
          );
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

  const handleClick = (value: string) => {
    if (status !== MatchStatus.Playing) return;
    processInput(value);
  };

  return { handleClick };
}

function evaluateAttempt(
  answer: string[],
  guesses: GuessState[],
  attempt: number,
) {
  const letterCountMap = new Map<string, number>();

  for (const letter of answer) {
    letterCountMap.set(letter, (letterCountMap.get(letter) || 0) + 1);
  }

  const guessLetters = [...guesses[attempt].letters];

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i].letter === answer[i]) {
      guessLetters[i] = {
        ...guessLetters[i],
        match: MatchState.Correct,
      };
      letterCountMap.set(
        guessLetters[i].letter,
        (letterCountMap.get(guessLetters[i].letter) ?? 0) - 1,
      );
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i].match === MatchState.Correct) continue;

    const letter = guessLetters[i].letter;
    const count = letterCountMap.get(letter) ?? 0;

    if (count > 0) {
      guessLetters[i] = {
        ...guessLetters[i],
        match: MatchState.Almost,
      };
      letterCountMap.set(letter, (letterCountMap.get(letter) || 0) - 1);
    } else {
      guessLetters[i] = {
        ...guessLetters[i],
        match: MatchState.Incorrect,
      };
    }
  }
  return guessLetters;
}
