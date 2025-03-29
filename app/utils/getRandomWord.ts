import { generate } from "random-words";

export function getRandomWord(): string {
  return generate({ minLength: 5, maxLength: 5 }) as string;
}
