import { PuzzleBase, Level, puzzleToLevel } from "../util";

type Rating = string | number;

type PuzzleBody = Rating[];

type PuzzlesJson = {
  head: (keyof PuzzleBase)[];
  body: PuzzleBody[];
};

const fromPuzzleJson = (json: PuzzlesJson) => {
  return json.body.reduce((out: Level[], item: PuzzleBody) => {
    const puzzle = item.reduce((p: PuzzleBase, v: Rating, ii: number) => {
      const key = json.head[ii];
      // @ts-ignore
      p[key] = v;
      return p;
    }, {} as PuzzleBase);
    out.push(puzzleToLevel(puzzle));
    return out;
  }, []);
};

const fetchPuzzles = (rating: Rating): Promise<Level[]> =>
  fetch("/lib/puzzles/" + rating + ".json")
    .then((r) => r.json())
    .then(fromPuzzleJson);

const puzzles: Level[] = [];
const loadedRatings: Record<Rating, Promise<any>> = {};

const getPuzzles = (rating: Rating): Promise<Level[]> => {
  if (!loadedRatings[rating]) {
    loadedRatings[rating] = fetchPuzzles(rating).then((p) =>
      p.forEach((p) => puzzles.push(p))
    );
  }
  return loadedRatings[rating].then(() => puzzles);
};

export default getPuzzles;
