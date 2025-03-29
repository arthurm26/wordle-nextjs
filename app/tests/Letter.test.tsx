import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Letter } from "@/app/components/Letter";
import { LetterState, MatchState } from "@/app/types";

test("Empty guess is rendered without letter.", async () => {
  const letter: LetterState = { letter: "", match: MatchState.Unknown };
  render(<Letter letter={letter} />);

  const guessElement = screen.getByTestId("letter-element");
  expect(guessElement).toHaveTextContent("");
});

test("Guess is rendered with correct letter.", async () => {
  const letter: LetterState = { letter: "A", match: MatchState.Unknown };
  render(<Letter letter={letter} />);

  const guessElement = screen.getByTestId("letter-element");
  expect(guessElement).toHaveTextContent("A");
  expect(guessElement).toHaveClass("bg-transparent border-gray-700");
});

test("Guess has green background when letter matches.", async () => {
  const letter: LetterState = { letter: "A", match: MatchState.Correct };
  render(<Letter letter={letter} />);

  const guessElement = screen.getByTestId("letter-element");
  expect(guessElement).toHaveClass("bg-green-500 border-transparent");
});

test("Guess has gray background when letter doesn't match.", async () => {
  const letter: LetterState = { letter: "A", match: MatchState.Incorrect };
  render(<Letter letter={letter} />);

  const guessElement = screen.getByTestId("letter-element");
  expect(guessElement).toHaveClass("bg-gray-700 border-transparent");
});

test("Guess has yellow background when letter almost matches.", async () => {
  const letter: LetterState = { letter: "A", match: MatchState.Almost };
  render(<Letter letter={letter} />);

  const guessElement = screen.getByTestId("letter-element");
  expect(guessElement).toHaveClass("bg-yellow-500 border-transparent");
});

test("Letter component matches snapshot.", () => {
  const letter: LetterState = { letter: "A", match: MatchState.Correct };
  const { container } = render(<Letter letter={letter} />);
  expect(container).toMatchSnapshot();
});
