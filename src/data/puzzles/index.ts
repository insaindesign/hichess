import { PuzzleBase, Level, puzzleToLevel } from "../util";

type PuzzleBody = string[];

type PuzzlesJson = {
  head: (keyof PuzzleBase)[];
  body: PuzzleBody[];
};

const fromPuzzleJson = (json: PuzzlesJson) => {
  return json.body.reduce((out: Level[], item: any) => {
    const puzzle = item.reduce((p: PuzzleBase, v: any, ii: number) => {
      const key = json.head[ii];
      p[key] = v;
      return p;
    }, {});
    out.push(puzzleToLevel(puzzle));
    return out;
  }, []);
};

const getPuzzles = (elo: string | number): Promise<Level[]> =>
  fetch("/lib/puzzles/" + elo + ".json")
    .then((r) => r.json())
    .then(fromPuzzleJson);

export default getPuzzles;
