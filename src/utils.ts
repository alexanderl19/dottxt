export type Lines = (undefined | string | (string | undefined)[])[];
export let joinLines = (lines: Lines) =>
  lines
    .flatMap((line) => line)
    .filter((line) => line !== undefined)
    .join("\n");
