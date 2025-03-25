"use client";

const keyboardFirstRow = "QWERTYUIOP".split("");
const keyboardSecondRow = "ASDFGHJKL".split("");
const keyboardThirdRow = "ZXCVBNM".split("");

export function Keyboard({
  handleClick,
}: {
  handleClick: (value: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-2 place-items-center justify-center m-3">
      <div className="flex space-x-2 justify-center">
        {keyboardFirstRow.map((ltr) => (
          <button
            className="text-white h-14 text-center font-bold bg-gray-500 rounded-md w-7 sm:w-12 md:w-14 lg:w-16"
            key={ltr}
            onClick={() => handleClick(ltr)}
          >
            {ltr}
          </button>
        ))}
      </div>
      <div className="flex space-x-2 justify-center">
        {keyboardSecondRow.map((ltr) => (
          <button
            className="text-white h-14 text-center font-bold bg-gray-500 rounded-md w-7 sm:w-12 md:w-14 lg:w-16"
            key={ltr}
            onClick={() => handleClick(ltr)}
          >
            {ltr}
          </button>
        ))}
      </div>
      <div className="flex space-x-2 justify-center">
        <button
          className="text-white h-14 text-center text-xs font-bold bg-gray-500 rounded-md w-12 sm:w-14 md:w-16 lg:w-18"
          key="Enter"
          onClick={() => handleClick("Enter")}
        >
          ENTER
        </button>
        {keyboardThirdRow.map((ltr) => (
          <button
            className="text-white h-14 text-center font-bold bg-gray-500 rounded-md w-7 sm:w-12 md:w-14 lg:w-16"
            key={ltr}
            onClick={() => handleClick(ltr)}
          >
            {ltr}
          </button>
        ))}
        <button
          className="text-white h-14 text-center text-xs font-bold bg-gray-500 rounded-md w-12 sm:w-14 md:w-16 lg:w-18"
          key="Backspace"
          onClick={() => handleClick("Backspace")}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
