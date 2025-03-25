import { LetterState } from "@/app/types";

type LetterProps = {
  letter: LetterState;
};

export function Letter({ letter }: LetterProps) {
  return (
    <div
      data-testid="letter-element"
      className={`w-12 h-12 flex items-center justify-center border text-white text-center font-bold text-2xl ${letter.match === "correct" ? "bg-green-500 border-transparent" : letter.match === "incorrect" ? "bg-gray-700 border-transparent" : letter.match === "almost" ? "bg-yellow-500 border-transparent" : "bg-transparent border-gray-700"}`}
    >
      {letter.letter ?? ""}
    </div>
  );
}
