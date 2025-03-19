import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Letter } from "@/app/components/Letter";
import { LetterState, MatchState } from "@/app/types";

test("renders an empty guess", async () => {
  const letter: LetterState = { letter: "", match: MatchState.Unknown };
  render(<Letter letter={letter} />);

  const guessElement = screen.getByTestId("letter-element");
  expect(guessElement).toBeInTheDocument();
  expect(guessElement).toHaveTextContent("");
});
