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
const start = 40000;
const MAX = 20000;

const parser = parse({ columns: true }, function (err, data: Row[]) {
  const filtered = data
    .filter((row) => parseInt(row.Rating, 10) < 1200)
    .slice(start, start + MAX);

  console.log("loaded rows", data.length, filtered.length);
  filtered.forEach((row) => {
    writeBatchQueue().set(db.collection("puzzle").doc(row.PuzzleId), {
      id: row.PuzzleId,
      fen: row.FEN,
      solution: row.Moves,
      rating: parseInt(row.Rating, 10),
      ratingChange: row.RatingDeviation,
      themes: row.Themes.split(" "),
    });
  });
  console.log("writing from", start, "to", start + MAX);
  writeBatchQueue(true);
});

const run = () => createReadStream(__dirname + "/puzzles.csv").pipe(parser);

export default run;
