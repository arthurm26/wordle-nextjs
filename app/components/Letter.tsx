import { LetterState } from "@/app/types";

type LetterProps = {
  letter: LetterState;
};

export function Letter({ letter }: LetterProps) {
  return (
    <div
      data-testid="letter-element"
      className={`w-12 h-12 border text-black text-center font-bold text-5xl ${letter.match === "correct" ? "bg-green-500" : "bg-gray-200"} ${letter.match === "incorrect" ? "bg-gray-700" : "bg-gray-200"} ${letter.match === "almost" ? "bg-yellow-300" : "bg-gray-200"}`}
    >
      {letter.letter ?? ""}
    </div>
  );
}
