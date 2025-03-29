import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Wordle from "@/app/components/Wordle";

jest.mock("@/app/utils/getRandomWord", () => {
  return {
    getRandomWord: jest.fn(() => "BROOM"),
  };
});

test("Empty Wordle board with no guesses yet.", async () => {
  render(<Wordle />);

  // const solutionHeading = screen.getByRole("heading", { level: 2 });
  // expect(solutionHeading).toHaveTextContent("BROOM");
});
