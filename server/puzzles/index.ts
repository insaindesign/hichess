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
const start = 60000;
const MAX = 20000;

const doWrite = false;

const write = (data: any[]) => {
  data.slice(start, start + MAX).forEach((row) => {
    writeBatchQueue().set(db.collection("puzzle").doc(row.id), row);
  });
  console.log("writing from", start, "to", start + MAX);
  writeBatchQueue(true);
}

const themes = new Set();
const themeFilter =
  /\b(pin|skewer|fork|mate|promotion|sacrifice|enPassant|discoveredAttack|doubleCheck|capturingDefender)\b/;
const groupThemes = [
  "pin",
  "skewer",
  "fork",
  "mate",
  "promotion",
  "sacrifice",
  "enPassant",
  "discoveredAttack",
  "doubleCheck",
  "capturingDefender",
];

const parser = parse({ columns: true }, function (err, data: Row[]) {
  const filtered = data
    .map((row) => {
      row.Themes.split(" ").forEach((t) => themes.add(t));
      return row;
    })
    .filter((row) => parseInt(row.Rating, 10) < 800)
    .filter((row) => Boolean(row.Themes.match(themeFilter)))
    .map((row) => ({
      id: row.PuzzleId,
      fen: row.FEN,
      solution: row.Moves,
      rating: parseInt(row.Rating, 10),
      ratingChange: row.RatingDeviation,
      themes: row.Themes.split(" "),
    }));

  const grouped = {};
  filtered.forEach((row) => {
    groupThemes.forEach((theme) => {
      if (!row.themes.includes(theme)){
        return;
      }
      if (!grouped[theme]) {
        grouped[theme] = [];
      }
      grouped[theme].push(row);
    });
  });
  const groupedSizes = [];
  Object.keys(grouped).forEach((theme) => {
    groupedSizes.push([theme, grouped[theme].length]);
  });
  console.log(groupedSizes);
  console.log("loaded rows", data.length, filtered.length);
  if (doWrite) {
    write(filtered);
  }
});

const run = () => createReadStream(__dirname + "/puzzles.csv").pipe(parser);

export default run;
