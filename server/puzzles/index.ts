import { createReadStream } from "fs";
import { parse } from "csv-parse";

import db, { writeBatchQueue } from "../db";

type Row = {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Rating: string;
  RatingDeviation: string;
  Themes: string;
};

// max 20000/day
const start = 20000;
const MAX = 20000;

const parser = parse({ columns: true }, function (err, data: Row[]) {
  data
    .filter((row) => parseInt(row.Rating, 10) < 1200)
    .slice(start, start + MAX)
    .forEach((row) => {
      writeBatchQueue().set(db.collection("puzzle").doc(row.PuzzleId), {
        id: row.PuzzleId,
        fen: row.FEN,
        solution: row.Moves,
        rating: parseInt(row.Rating, 10),
        ratingChange: row.RatingDeviation,
        themes: row.Themes.split(" "),
      });
    });
  writeBatchQueue(true);
});

const run = () => createReadStream(__dirname + "/puzzles.csv").pipe(parser);

export default run;
