import { PuzzleBase, Level, puzzleToLevel } from "../util";

type PuzzleBody = (string | number)[];

type PuzzlesJson = {
  head: (keyof PuzzleBase)[];
  body: PuzzleBody[];
};

const fromPuzzleJson = (json: PuzzlesJson) => {
  return json.body.reduce((out: Level[], item: PuzzleBody) => {
    const puzzle = item.reduce((p: PuzzleBase, v: string | number, ii: number) => {
      const key = json.head[ii];
      // @ts-ignore
      p[key] = v;
      return p;
    }, {} as PuzzleBase);
    out.push(puzzleToLevel(puzzle));
    return out;
  }, []);
};

const getPuzzles = (rating: string | number): Promise<Level[]> =>
  fetch("/lib/puzzles/" + rating + ".json")
    .then((r) => r.json())
    .then(fromPuzzleJson);

export default getPuzzles;
